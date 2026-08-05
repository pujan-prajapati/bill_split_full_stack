import random

from django.contrib.auth import get_user_model
from rest_framework import serializers

from utils.send_email import send_email

User = get_user_model()


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "avatar", "full_name"]


# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "password",
            "first_name",
            "last_name",
        ]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# Login Serializer
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


# Profile Serializer
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "avatar",
        ]


# Change Passowrd Serializer
class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, write_only=True)
    confirm_password = serializers.CharField(max_length=255, write_only=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                "Passowrd and confirm password doesn't match"
            )

        return attrs

    def save(self):
        user = self.context.get("user")
        password = self.validated_data.get("password")
        user.set_password(password)
        user.save(update_fields=["password"])
        return user


# Change Avatar Serializer
class ChangeAvatarSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["avatar"]


# Send Passowrd Rest Email Seriazlier
class SendPasswordRestEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        try:
            attrs["user"] = User.objects.get(email=attrs["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Email not found")

        return attrs

    def save(self):
        user = self.validated_data.get("user")
        otp = random.randint(100000, 999999)
        data = {
            "subject": "Reset your password",
            "body": f"Verify otp with {otp}",
            "to_email": user.email,
        }
        send_email(data)
        user.otp = str(otp)
        user.save(update_fields=["otp"])

        return user


# Verify Otp Serializer
class VerifyOtpSerializer(serializers.Serializer):
    otp = serializers.CharField()
    email = serializers.EmailField()

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Email not found")

        if user.otp != attrs["otp"]:
            raise serializers.ValidationError("OPT doesn't match")

        attrs["user"] = user
        return attrs

    def save(self):
        user = self.validated_data["user"]
        user.otp = None
        user.otp_verified = True
        user.save(update_fields=["otp", "otp_verified"])
        return user


# Password Reset Serializer
class PasswordRestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        try:
            user = User.objects.get(email=attrs["email"])
        except User.DoesNotExist:
            raise serializers.ValidationError("Email not found")

        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                "Password and confirm password don't match"
            )

        if not user.otp_verified:
            raise serializers.ValidationError("OTP verification required")

        attrs["user"] = user
        return attrs

    def save(self):
        user = self.validated_data.get("user")
        password = self.validated_data.get("password")
        user.set_password(password)
        user.otp_verified = False
        user.save(update_fields=["password", "otp_verified"])

        return user
