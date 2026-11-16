from django.shortcuts import render

# Create your views here.
import logging

from django.conf import settings
from django.core.mail import EmailMessage

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle

from .serializers import ContactSerializer

logger = logging.getLogger(__name__)

def home(request):
    return render(request,"index.html")

from django.conf import settings

print("EMAIL:", settings.EMAIL_HOST_USER)
print("PASSWORD EXISTS:", bool(settings.EMAIL_HOST_PASSWORD))
print("HOST:", settings.EMAIL_HOST)
print("PORT:", settings.EMAIL_PORT)


class ContactAPIView(APIView):

    permission_classes = [AllowAny]

    authentication_classes = []

    throttle_classes = [ScopedRateThrottle]

    throttle_scope = 'contact'

    def post(self, request):

        serializer = ContactSerializer(data=request.data)

        if serializer.is_valid():

            name = serializer.validated_data['name']
            email = serializer.validated_data['email']
            subject = serializer.validated_data['subject']
            message = serializer.validated_data['message']

            if not settings.PORTFOLIO_RECEIVER_EMAIL:
                return Response(
                    {
                        "success": False,
                        "message": "Email service is not configured."
                    },
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

            email_subject = f"Portfolio Contact: {subject}"

            email_body = f"""
New message from your portfolio website.

Name: {name}

Email: {email}

Subject: {subject}

Message:

{message}
"""

            try:

                mail = EmailMessage(
                    subject=email_subject,
                    body=email_body,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[settings.PORTFOLIO_RECEIVER_EMAIL],
                    reply_to=[email]
                )

                mail.send(fail_silently=False)

                return Response(
                    {
                        "success": True,
                        "message": "Your message has been sent successfully!"
                    },
                    status=status.HTTP_200_OK
                )

            except Exception:

                logger.exception("Portfolio contact email failed")

                return Response(
                    {
                        "success": False,
                        "message": "Unable to send your message. Please try again later."
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )

        return Response(
            {
                "success": False,
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )