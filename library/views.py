import pdb

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import status, generics, views, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.contrib.auth import authenticate, update_session_auth_hash
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import get_object_or_404
from django.urls import reverse

from .serializers import *
from .models import User, Book, Wishlist, Review, Order, Payment, Category, Transaction
from .permissions import IsOwnerOrReadOnly
from .filters import BookFilter



@api_view(['GET'])
def info_page(request):
    data = {
        'register': request.build_absolute_uri(reverse('register')),
        'login': request.build_absolute_uri(reverse('login')),
        'logout': request.build_absolute_uri(reverse('logout')),
        'userlist': request.build_absolute_uri(reverse('user-list')),
        'books': request.build_absolute_uri(reverse('book-list')),
        'one_book': request.build_absolute_uri(reverse('book-detail', kwargs={'pk': 1})),
        'trending_books': request.build_absolute_uri(reverse('book-trending-list')),
        'category': request.build_absolute_uri(reverse('category-list')),
        'one_category': request.build_absolute_uri(reverse('category-detail', kwargs={'pk': 1})),
        'wishlist': request.build_absolute_uri(reverse('wishlist-list')),
        'one_wishlist': request.build_absolute_uri(reverse('wishlist-detail', kwargs={'pk': 1})),
        'reviews': request.build_absolute_uri(reverse('review-list')),
        'one_review': request.build_absolute_uri(reverse('review-detail', kwargs={'pk': 1})),
        'orders': request.build_absolute_uri(reverse('order-list')),
        'one_order': request.build_absolute_uri(reverse('order-detail', kwargs={'pk': 1})),
        'payments': request.build_absolute_uri(reverse('payment-list')),
        'one_payment': request.build_absolute_uri(reverse('payment-detail', kwargs={'pk': 1})),
        'transactions': request.build_absolute_uri(reverse('transaction-list')),
        'one_transaction':request.build_absolute_uri(reverse('transaction-detail', kwargs={'pk': 1})),
    }

    return Response(data)


# @api_view(['POST'])
# def register_user(request):
#     serializer = UserSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
register_user = RegisterUserView.as_view()


# @api_view(['POST'])
# def login_user(request):
#     email = request.data.get('email')
#     password = request.data.get('password')

#     user = None
#     if '@' in email:
#         try:
#             user = User.objects.get(email=email)
#         except ObjectDoesNotExist:
#             pass

#     if not user:
#         user = authenticate(email=email, password=password)

#     if user:
#         token, _ = Token.objects.get_or_create(user=user)
#         return Response({'token': token.key}, status=status.HTTP_200_OK)

#     return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LoginUserView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = None

        if '@' in email:
            try:
                user = User.objects.get(email=email)
            except ObjectDoesNotExist:
                pass

        if not user:
            user = authenticate(email=email, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
login_user = LoginUserView.as_view()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_logout(request):
    try:
        # Delete the user's token to logout
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# @api_view(['GET'])
# def user_list(request):
#     users = User.objects.all()
#     serializer = UserListSerializer(users, many=True)
#     return Response(serializer.data)

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
user_list = UserList.as_view()


def change_password(request):
    if request.method == 'POST':
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid:
            user = request.user
            if user.check_password(serializer.data.get('old_password')):
                user.set_password(serializer.data.get('new_password'))
                user.save()
                update_session_auth_hash(request, user)  # Updating session after password change
                return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'Incorrect old password.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# @api_view(['GET', 'POST'])
# def category_list(request):
#     if request.method == 'GET':
#         categories = Category.objects.all()
#         serializer = CategorySerializer(categories, many=True)
#         return Response(serializer.data)
    
#     elif request.method == 'POST':
#         serializer = CategorySerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryList(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

category_list = CategoryList.as_view()  # This now is a function, so I change its url


@api_view(['GET', 'DELETE'])
def category_detail(request, pk):
    # try:
    #     category = Category.objects.get(pk=pk)
    # except Category.DoesNotExist:
    #     return Response(status=status.HTTP_404_NOT_FOUND)
    category = get_object_or_404(Category, pk=pk)

    if request.method == 'GET':
        serializer = CategorySerializer(category)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Category.objects.all()
#     serializer_class = CategorySerializer

# category_detail = CategoryDetail.as_view()



# @api_view(['GET', 'POST'])
# def book_list(request):
#     if request.method == 'GET':
#         books = Book.objects.all()
#         serializer = BookSerializer(books, many=True)
#         return Response(serializer.data)
    
#     elif request.method == 'POST':
#         serializer = BookSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookList(generics.ListCreateAPIView):
    # pdb.set_trace()
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = BookFilter
    # filter_backends = [filters.SearchFilter]
    # search_fields = ['book_name', 'author_name', 'category_id__category_name']

    def perform_create(self, serializer):
        brief_abstraction = serializer.validated_data.get('brief_abstraction')
        long_abstraction = serializer.validated_data.get('long_abstraction')
        if long_abstraction is None:
            long_abstraction = brief_abstraction
        serializer.save(long_abstraction = long_abstraction)

book_list = BookList.as_view()


class BookTrendingList(generics.ListAPIView):
    serializer_class = BookSerializer

    # I made it function 
    def get_queryset(self):
        half = Book.objects.count() // 2
        return Book.objects.all().order_by('-num_of_sells')[:half]
    
book_trending_list = BookTrendingList.as_view()


# @api_view(['GET', 'DELETE'])
# def book_detail(request, pk):
#     # try:
#     #     book = Book.objects.get(pk=pk)
#     # except Book.DoesNotExist:
#     #     return Response(status=status.HTTP_404_NOT_FOUND)
#     book = get_object_or_404(Book, pk=pk)
    
#     if request.method == 'GET':
#         serializer = BookSerializer(book)
#         return Response(serializer.data)
    
#     elif request.method == 'DELETE':
#         book.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    

class BookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                     IsOwnerOrReadOnly]
    
    def perform_update(self, serializer):
        instance = serializer.save()
        if not instance.long_abstraction:
            instance.long_abstraction = instance.brief_abstraction

book_detail = BookDetail.as_view()



@api_view(['GET', 'POST'])
def wishlist_list(request):
    if request.method == 'GET':
        wishlist = Wishlist.objects.all()
        serializer = WishlistSerializer(wishlist, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = WishlistSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
def wishlist_detail(request, pk):
    # try:
    #     item = Wishlist.objects.get(pk=pk)
    # except Wishlist.DoesNotExist:
    #     return Response(status=status.HTTP_404_NOT_FOUND)
    item = get_object_or_404(Wishlist, pk=pk)

    if request.method == 'GET':
        serializer = WishlistSerializer(item)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    






@api_view(['GET', 'POST'])
def review_list(request):
    if request.method == 'GET':
        reviews = Review.objects.all()
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ReviewSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE', 'PUT'])
def review_detail(request, pk):
    # try:
    #     review = Review.objects.get(pk=pk)
    # except Review.DoesNotExist:
    #     return Response(status=status.HTTP_404_NOT_FOUND)
    review = get_object_or_404(Review, pk=pk)

    if request.method == 'GET':
        serializer = ReviewSerializer(review)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        review.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serializer = ReviewSerializer(review, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# @permission_classes([permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly])
# @api_view(['GET', 'POST'])
# def order_list(request):
#     if request.method == 'GET':
#         orders = Order.objects.all()
#         serializer = OrderSerializer(orders, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = OrderSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderList(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    print(repr(TransactionSerializer()))


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

order_list = OrderList.as_view()


# @permission_classes([permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly])
# @api_view(['GET', 'DELETE', 'PUT'])
# def order_detail(request, pk):
#     # try:
#     #     order = Order.objects.get(pk=pk)
#     # except Order.DoesNotExist:
#     #     return Response(status=status.HTTP_404_NOT_FOUND)
#     order = get_object_or_404(Order, pk=pk)

#     if request.method == 'GET':
#         serializer = OrderSerializer(order)
#         return Response(serializer.data)

#     elif request.method == 'DELETE':
#         order.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

#     elif request.method == 'PUT':
#         serializer = OrderSerializer(order, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrderDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                     IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

order_detail = OrderDetail.as_view()





@api_view(['GET', 'POST'])
def payment_list(request):
    if request.method == 'GET':
        payments = Payment.objects.all()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE', 'PUT'])
def payment_detail(request, pk):
    # try:
    #     payment = Payment.objects.get(pk=pk)
    # except Payment.DoesNotExist:
    #     return Response(status=status.HTTP_404_NOT_FOUND)
    payment = get_object_or_404(Payment, pk=pk)

    if request.method == 'GET':
        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    elif request.method == 'DELETE':
        payment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'PUT':
        serializer = PaymentSerializer(payment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






# @api_view(['GET', 'POST'])
# def transaction_list(request):
#     if request.method == 'GET':
#         transactions = Transaction.objects.all()
#         serializer = TransactionSerializer(transactions, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = TransactionSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionList(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly,
    #                     IsOwnerOrReadOnly]

    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)
transaction_list = TransactionList.as_view()


# @api_view(['GET', 'DELETE', 'PUT'])
# def transaction_detail(request, pk):
#     # try:
#     #     transaction = Transaction.objects.get(pk=pk)
#     # except Transaction.DoesNotExist:
#     #     return Response(status=status.HTTP_404_NOT_FOUND)
#     transaction = get_object_or_404(Transaction, pk=pk)

#     if request.method == 'GET':
#         serializer = TransactionSerializer(transaction)
#         return Response(serializer.data)

#     elif request.method == 'DELETE':
#         transaction.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

#     elif request.method == 'PUT':
#         serializer = TransactionSerializer(transaction, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TransactionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
transaction_detail = TransactionDetail.as_view()




# -------------------- Notes ----------------------- #
# - 1 - With generic-class-based-views I can make functions
# for creating (perform_create(self, serializer)), updating
# (perofrm_update(self, serializer)) 
