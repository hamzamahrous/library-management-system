from django.urls import path, include
from .views import *
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [

    # YOUR PATTERNS
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('', info_page, name='info'),

    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('userlist/', user_list, name='user-list'),

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
    
    path('payments/', payment_list, name='payment-list'),
    path('payments/<int:pk>/', payment_detail, name='payment-detail'),

    path('transactions/', transaction_list, name='transaction-list'),
    path('transactions/<int:pk>/', transaction_detail, name='transaction-detail'),


    # path('logout/', user_logout, name='logout'),
    # path('logout/', user_logout, name='logout'),
]