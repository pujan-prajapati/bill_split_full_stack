import { httpGet, httpPost, uploader } from "@/axios";
import type {
  ChangePasswordPayloadTypes,
  LoginResponseTypes,
  LoginUserPayloadTypes,
  RegisterUserPayloadTypes,
  UserResponseType,
} from "@/types/user.types";

// register user
export const registerUser = async (formData: RegisterUserPayloadTypes) => {
  const response = await httpPost<RegisterUserPayloadTypes, LoginResponseTypes>(
    "/user/register/",
    formData,
  );
  return response.data;
};

// login user
export const loginUser = async (formData: LoginUserPayloadTypes) => {
  const response = await httpPost<LoginUserPayloadTypes, LoginResponseTypes>(
    "/user/login/",
    formData,
  );

  return response.data;
};

// get me
export const getMe = async () => {
  const response = await httpGet<UserResponseType>("/user/profile/");
  return response.data.user;
};

// logout user
export const logoutUser = async () => {
  await httpPost("/user/logout/", null);
};

// change password
export const changePassword = async (formData: ChangePasswordPayloadTypes) => {
  const respones = await httpPost("/user/change-password/", formData);
  return respones.data;
};

// change avatar
export const changeAvatar = async (avatar: File) => {
  const response = await uploader(
    "/user/change-avatar/",
    "PATCH",
    {},
    "avatar",
    avatar,
  );
  return response.data;
};

// forgot password
export const forgotPassword = async (email: { email: string }) => {
  const response = await httpPost("/user/forgot-password/", email);
  return response.data;
};

// verify otp
type VerifyOtpTypes = {
  email: string;
  otp: string;
};
export const verifyOtp = async (formData: VerifyOtpTypes) => {
  const response = await httpPost("/user/verify-otp/", formData);
  return response.data;
};

// reset password
export const resetPassword = async (formData: ChangePasswordPayloadTypes) => {
  const respones = await httpPost("/user/reset-password/", formData);
  return respones.data;
};
