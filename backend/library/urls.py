from django.urls import path, include
from .views import *

urlpatterns = [

    path('register/', register_user, name='register'),
    path('login/', user_login, name='login'),
    path('logout/', user_logout, name='logout'),
    path('userlist/', user_list, name='user-list'),

    # path('books/', book_list, name='book_list'),
    # path('books/<int:pk>', book_detail, name='book_list'),
    path('books/', BookList.as_view(), name='book-list'),
    path('books/<int:pk>/', BookDetail.as_view(), name='book-detail'),

    path('trending-books/', BookTrendingList.as_view(), name='trending-book-list'),

    path('category/', category_list, name='category_list'),
    path('category/<int:pk>', category_detail, name='category_list'),
    path('wishlist/', wishlist_list, name='wishlist-list'),
    path('wishlist/<int:pk>/', wishlist_detail, name='wishlist-detail'),

    path('reviews/', review_list, name='review-list'),
    path('reviews/<int:pk>/', review_detail, name='review-detail'),
    
    # path('orders/', order_list, name='order-list'),
    # path('orders/<int:pk>/', order_detail, name='order-detail'),
    path('orders/', OrderList.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetail.as_view(), name='order-detail'),
    
    path('payments/', payment_list, name='payment-list'),
    path('payments/<int:pk>/', payment_detail, name='payment-detail'),

    # path('transactions/', transaction_list, name='transaction-list'),
    # path('transactions/<int:pk>/', transaction_detail, name='transaction-detail'),
    path('transactions/', TransactionList.as_view(), name='transaction-list'),
    path('transactions/<int:pk>/', TransactionDetail.as_view(), name='transaction-detail'),


    # path('logout/', user_logout, name='logout'),
    # path('logout/', user_logout, name='logout'),
]