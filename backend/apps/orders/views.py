import json

import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.cart.services import get_or_create_cart

from .models import Order, OrderItem
from .serializers import CheckoutSerializer, OrderSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


class CreateCheckoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        cart = get_or_create_cart(request)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        line_items = []
        for item in cart.items.all():
            image_url = item.product.image_url
            primary = item.product.images.filter(is_primary=True).first()
            if primary and primary.image_url:
                image_url = primary.image_url

            product_data = {
                'name': item.product.name,
            }
            if image_url:
                product_data['images'] = [image_url]

            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': product_data,
                    'unit_amount': int(item.product.price * 100),
                },
                'quantity': item.quantity,
            })

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            total=cart.total,
            shipping_name=data['shipping_name'],
            shipping_email=data['shipping_email'],
            shipping_address=data['shipping_address'],
            shipping_city=data['shipping_city'],
            shipping_state=data['shipping_state'],
            shipping_zip=data['shipping_zip'],
        )

        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                quantity=item.quantity,
                price_at_purchase=item.product.price,
            )

        if not settings.STRIPE_SECRET_KEY:
            order.status = 'paid'
            order.save()
            cart.items.all().delete()
            return Response({
                'checkout_url': f'{settings.FRONTEND_URL}/checkout/success?order_id={order.id}',
                'order_id': order.id,
                'demo_mode': True,
            })

        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url=f'{settings.FRONTEND_URL}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'{settings.FRONTEND_URL}/checkout/cancel',
                customer_email=data['shipping_email'],
                metadata={'order_id': str(order.id)},
            )
            order.stripe_session_id = session.id
            order.save()
            return Response({'checkout_url': session.url, 'order_id': order.id})
        except stripe.error.StripeError as e:
            order.delete()
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')

    if not settings.STRIPE_WEBHOOK_SECRET:
        return HttpResponse(status=200)

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return HttpResponse(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session.get('metadata', {}).get('order_id')
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                order.status = 'paid'
                order.save()
            except Order.DoesNotExist:
                pass

    return HttpResponse(status=200)
