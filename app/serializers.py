from rest_framework import serializers


class ContactSerializer(serializers.Serializer):

    name = serializers.CharField(max_length=100)

    email = serializers.EmailField()

    subject = serializers.CharField(max_length=150)

    message = serializers.CharField(max_length=5000)

    # Hidden field to help detect spam bots
    website = serializers.CharField(
        required=False,
        allow_blank=True,
        write_only=True
    )

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError(
                "Invalid submission."
            )
        return value