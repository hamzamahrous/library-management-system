from django.urls import path, include
from .views import *
# from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [

    # YOUR PATTERNS
    # path('schema/', SpectacularAPIView.as_view(), name='schema'),
    # # Optional UI:
    # path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('', info_page, name='info'),

    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('logout/', user_logout, name='logout'),
    path('userlist/', user_list, name='user-list'),
    path('userdetail/<int:pk>/', user_detail, name='user-detail'),

    # password change & reset
    path('change_password/', change_password, name='change-password'),

    path('books/', book_list, name='book-list'),
    path('books/<int:pk>/', book_detail, name='book-detail'),

    path('trending-books/', book_trending_list, name='book-trending-list'),

    path('category/', category_list, name='category-list'),
    path('category/<int:pk>/', category_detail, name='category-detail'),

    path('wishlist/', wishlist_list, name='wishlist-list'),
    path('wishlist/<int:pk>/', wishlist_detail, name='wishlist-detail'),

    path('reviews/', review_list, name='review-list'),
    path('reviews/<int:pk>/', review_detail, name='review-detail'),
    
    path('orders/', order_list, name='order-list'),
    path('orders/<int:pk>/', order_detail, name='order-detail'),
    path('create-order-from-cart/', create_order_from_cart, name='create-order-from-cart'),
    
    path('payments/', payment_list, name='payment-list'),
    path('payments/<int:pk>/', payment_detail, name='payment-detail'),

    path('transactions/', transaction_list, name='transaction-list'),
    path('transactions/<int:pk>/', transaction_detail, name='transaction-detail'),

    path('pay/<int:order_id>/', CreateCheckoutSessionView.as_view(), name='pay'),
    path('webhook/stripe/', stripe_webhook, name='stripe-webhook'),

    path('ai-model/', ai_model, name='ai-model'),

    # path('logout/', user_logout, name='logout'),
    # path('logout/', user_logout, name='logout'),



    path('pay/<int:order_id>/success_payment/', success_payment, name='success_payment'),
    path('webhook/stripe/', stripe_webhook, name='stripe-webhook'),

]