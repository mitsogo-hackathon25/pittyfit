from django.contrib.auth import get_user_model

from .models import Cart, CartItem

User = get_user_model()


def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart

    if not request.session.session_key:
        request.session.create()

    session_key = request.session.session_key
    cart, _ = Cart.objects.get_or_create(session_key=session_key, user=None)
    return cart


def merge_carts(user, session_key):
    if not session_key:
        return

    user_cart, _ = Cart.objects.get_or_create(user=user)
    session_cart = Cart.objects.filter(session_key=session_key, user=None).first()

    if not session_cart:
        return

    for item in session_cart.items.all():
        existing = user_cart.items.filter(product=item.product).first()
        if existing:
            existing.quantity += item.quantity
            existing.save()
        else:
            item.cart = user_cart
            item.save()

    session_cart.items.all().delete()
    session_cart.delete()
