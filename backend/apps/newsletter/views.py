from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Subscriber
from .serializers import SubscriberSerializer


class SubscribeView(APIView):
    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        subscriber, created = Subscriber.objects.get_or_create(email=email)
        if not created:
            return Response({'message': 'Already subscribed'}, status=status.HTTP_200_OK)

        return Response(
            SubscriberSerializer(subscriber).data,
            status=status.HTTP_201_CREATED,
        )
