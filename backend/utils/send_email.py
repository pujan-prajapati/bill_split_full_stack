from django.core.mail import EmailMessage


def send_email(data):
    email = EmailMessage(
        subject=data["subject"],
        body=data["body"],
        from_email="test@gmail.com",
        to=[data["to_email"]],
    )
    email.send()


