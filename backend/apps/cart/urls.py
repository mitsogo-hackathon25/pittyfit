from django.urls import path

from .views import CartAddView, CartItemUpdateView, CartView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('add/', CartAddView.as_view(), name='cart-add'),
    path('items/<int:item_id>/', CartItemUpdateView.as_view(), name='cart-item'),
]
