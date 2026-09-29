from django.urls import path

from .views import CreateCheckoutView, OrderListView, stripe_webhook

urlpatterns = [
    path('', OrderListView.as_view(), name='orders'),
    path('create-checkout/', CreateCheckoutView.as_view(), name='create-checkout'),
    path('webhook/', stripe_webhook, name='stripe-webhook'),
]
