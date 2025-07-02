import pdb
import stripe

from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import redirect

from rest_framework import status, generics, views, permissions, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly

from django.contrib.auth import authenticate, update_session_auth_hash
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django.http import JsonResponse, HttpResponse

from .serializers import *
from .models import User, Book, Wishlist, Review, Order, Payment, Category, Transaction
from .permissions import IsOwnerOrReadOnly, IsOwnerOnly
from .filters import BookFilter



@api_view(['GET'])
def info_page(request):
    data = {
        'register': request.build_absolute_uri(reverse('register')),
        'login': request.build_absolute_uri(reverse('login')),
        'logout': request.build_absolute_uri(reverse('logout')),
        'password_reset': request.build_absolute_uri(reverse('change-password')),
        'userlist': request.build_absolute_uri(reverse('user-list')),
        'userdetail': request.build_absolute_uri(reverse('user-detail', kwargs={'pk': 1})),
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
        'create_order_from_cart': request.build_absolute_uri(reverse('create-order-from-cart')),
        'payments': request.build_absolute_uri(reverse('payment-list')),
        'one_payment': request.build_absolute_uri(reverse('payment-detail', kwargs={'pk': 1})),
        'transactions': request.build_absolute_uri(reverse('transaction-list')),
        'one_transaction':request.build_absolute_uri(reverse('transaction-detail', kwargs={'pk': 1})),
        'ai_model':request.build_absolute_uri(reverse('ai-model')),
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
                return Response({'error': 'No user found with this email'},
                                status=status.HTTP_404_NOT_FOUND)

        try:
            user = authenticate(username=user.username, password=password)
        except:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        if user:
            transactions = Transaction.objects.filter(user=user.id)
            orders = Order.objects.filter(user=user.id)
            wishlist = Wishlist.objects.filter(user=user.id)

            transactions_data = TransactionSerializer(transactions, many=True).data
            orders_data = OrderSerializer(orders, many=True).data
            wishlist_data = WishlistSerializer(wishlist, many=True).data

            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key,
                            'user': {
                                'id': user.id,
                                'username': user.username,
                                'email': user.email,
                                'first_name': user.first_name,
                                'last_name': user.last_name
                            },
                            'transactions': transactions_data,
                            'orders': orders_data,
                            'wishlist': wishlist_data
                        },status=status.HTTP_200_OK)

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
    queryset = User.objects.prefetch_related('transactions').all()
    serializer_class = UserListSerializer
    # permission_classes = [IsAuthenticated]
user_list = UserList.as_view()


class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserListSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

user_detail = UserDetail.as_view()

@api_view(['POST'])
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



# @api_view(['GET', 'POST'])
# def wishlist_list(request):
#     if request.method == 'GET':
#         wishlist = Wishlist.objects.all()
#         serializer = WishlistSerializer(wishlist, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = WishlistSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WishlistList(generics.ListCreateAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

wishlist_list = WishlistList.as_view()


# @api_view(['GET', 'DELETE'])
# def wishlist_detail(request, pk):
#     # try:
#     #     item = Wishlist.objects.get(pk=pk)
#     # except Wishlist.DoesNotExist:
#     #     return Response(status=status.HTTP_404_NOT_FOUND)
#     item = get_object_or_404(Wishlist, pk=pk)

#     if request.method == 'GET':
#         serializer = WishlistSerializer(item)
#         return Response(serializer.data)

#     elif request.method == 'DELETE':
#         item.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
    
class WishlistDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

wishlist_detail = WishlistDetail.as_view()


# @api_view(['GET', 'POST'])
# def review_list(request):
#     if request.method == 'GET':
#         reviews = Review.objects.all()
#         serializer = ReviewSerializer(reviews, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = ReviewSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewList(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                        IsOwnerOrReadOnly]


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

review_list = ReviewList.as_view()


# @api_view(['GET', 'DELETE', 'PUT'])
# def review_detail(request, pk):
#     # try:
#     #     review = Review.objects.get(pk=pk)
#     # except Review.DoesNotExist:
#     #     return Response(status=status.HTTP_404_NOT_FOUND)
#     review = get_object_or_404(Review, pk=pk)

#     if request.method == 'GET':
#         serializer = ReviewSerializer(review)
#         return Response(serializer.data)

#     elif request.method == 'DELETE':
#         review.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

#     elif request.method == 'PUT':
#         serializer = ReviewSerializer(review, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                        IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

review_detail = ReviewDetail.as_view()



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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
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
    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                        IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['POST']) # 
    def success_payment(self, request, pk):
        order = self.get_object()
        order.order_status = StatusChoices.CONFIRMED
        order.save()
        serializer = OrderSerializer(order)
        data = {
            'msg': "Payment Is Successful",
            'data': serializer.data
        }
        return Response(data)

order_detail = OrderDetail.as_view()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order_from_cart(request):
    user = request.user
    shipping_address = request.data.get("shipping_address")
    
    # Get all unlinked transactions (cart items)
    cart_transactions = Transaction.objects.filter(user=user, order__isnull=True)
    
    if not cart_transactions.exists():
        return Response({'error': 'Cart is empty'}, status=400)

    total_price = sum([t.book.price * t.quantity for t in cart_transactions])

    # Create order
    order = Order.objects.create(
        user=user,
        total_price=total_price,
        shipping_address=shipping_address,
        order_status=Order.StatusChoices.PENDING,
        is_paid=False
    )

    # Link transactions to the new order
    cart_transactions.update(order=order)

    return Response({'message': 'Order created successfully', 'order_id': order.order_id}, status=201)



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
    # queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsOwnerOrReadOnly, IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user.id)
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
    permission_classes = [IsAuthenticated]

    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user.id)
transaction_detail = TransactionDetail.as_view()


@api_view(['GET'])
def payment_list(request):
    payments = Payment.objects.all()
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


# @api_view(['GET', 'POST'])
# def payment_list(request):
#     if request.method == 'GET':
#         payments = Payment.objects.all()
#         serializer = PaymentSerializer(payments, many=True)
#         return Response(serializer.data)

#     elif request.method == 'POST':
#         serializer = PaymentSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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








# ------------------------------- Payment ---------------------------------------------

stripe.api_key = settings.STRIPE_SECRET_KEY

# class CreateCheckoutSessionView(views.APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, order_id):
#         try:
#             order = Order.objects.get(order_id=order_id, user=request.user)
#             line_items = []

#             for item in order.transactions.all():
#                 line_items.append({
#                     'price_data': {
#                         'currency': 'usd',
#                         'product_data': {
#                             'name': item.book.book_name,
#                         },
#                         'unit_amount': int(item.book.price * 100),  # stripe expects amount to be in the smallest currency (cent).
#                     },
#                     'quantity': item.quantity,
#                 })

#             # Check line_items is not empty
#             if not line_items:
#                 return Response({"error": "No items found in order."}, status=400)

#             session = stripe.checkout.Session.create(
#                 payment_method_types=['card'],
#                 line_items=line_items,
#                 mode='payment',
#                 # success_url=settings.FRONTEND_URL + '/payment-success?session_id={CHECKOUT_SESSION_ID}',
#                 success_url = f'http://127.0.0.1:8000/api/pay/{order.order_id}/success_payment/',
#                 cancel_url=settings.FRONTEND_URL + '/payment-cancelled',
#                 metadata={'order_id': order.order_id}
#             )

#             return Response({'sessionUrl': session.url})
#         except Order.DoesNotExist:
#             return Response({'error': 'Order not found or already paid'}, status=404)
class CreateCheckoutSessionView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(order_id=order_id, user=request.user)
            if order.is_paid:
                return Response({'error': 'this order is already paid ! '}, status=400)

            line_items = []
            total_price = 0

            for item in order.transactions.all():
                line_items.append({
                    'price_data': {
                        'currency': 'usd',
                        'product_data': {
                            'name': item.book.book_name,
                        },
                        'unit_amount': int(item.book.price * 100),  # stripe expects amount to be in the smallest currency (cent).
                    },
                    'quantity': item.quantity,
                })
                total_price += item.book.price * item.quantity

            # Check line_items is not empty
            if not line_items:
                return Response({"error": "No items found in order."}, status=400)

            payment = Payment.objects.create(
                order=order,
                user=request.user,
                payment_method=Payment.PaymentMethod.CREDIT_CARD,
                amount=total_price,
                payment_status=Payment.PaymentStatus.PENDING,
            )

            
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=line_items,
                mode='payment',
                success_url=f'http://127.0.0.1:8000/api/pay/{order.order_id}/success_payment/',
                cancel_url=settings.FRONTEND_URL + '/payment-cancelled',
                metadata={'order_id': order.order_id}
            )

            
            payment.stripe_payment_id = session.id
            payment.save()

            return Response({'sessionUrl': session.url})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found or already paid'}, status=404)
@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META['HTTP_STRIPE_SIGNATURE']
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except stripe.error.SignatureVerificationError:
        return Response(status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session['metadata']['order_id']
        try:
            order = Order.objects.get(order_id=order_id)
            order.order_status = Order.StatusChoices.CONFIRMED
            order.is_paid = True
            order.save()

            # تحديث الـ Payment
            payment = order.payments.filter(stripe_payment_id=session.id).first()
            if payment:
                payment.payment_status = Payment.PaymentStatus.CONFIRMED
                payment.payment_time = timezone.now()
                payment.save()
            else:
                return Response({'error': 'Payment not found'}, status=404)

            # إضافة Transaction لو مش موجودة (اختياري)
            payment_intent = session.get('payment_intent')
            if payment_intent:
                payment_intent_data = stripe.PaymentIntent.retrieve(payment_intent)
                for transaction in order.transactions.all():
                    transaction_obj, created = Transaction.objects.get_or_create(
                        order=order,
                        user=order.user,
                        book=transaction.book,
                        quantity=transaction.quantity,
                    )
                    transaction_obj.save()

        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)

    return Response(status=200)


@csrf_exempt  # in case CSRF token is missing from Stripe redirect
def success_payment(request, order_id):
    if request.method != 'GET':
        return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

    try:
        order = Order.objects.get(order_id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'error': 'Order not found'}, status=404)

    transactions = order.transactions.all()
    if not transactions.exists():
        return JsonResponse({'error': 'No items found in order'}, status=400)

    # Update stock
    for transaction in transactions:
        book = transaction.book
        quantity = transaction.quantity

        if book.stock_quantity < quantity:
            return JsonResponse({'error': f'Not enough stock for book {book.book_name}'}, status=400)

        book.stock_quantity -= quantity
        book.num_of_sells += quantity
        book.save()

    # Mark order as paid
    order.order_status = Order.StatusChoices.CONFIRMED
    order.is_paid = True
    order.save()

    payment = order.payments.first()
    if payment:
        payment.payment_status = Payment.PaymentStatus.CONFIRMED
        payment.payment_time = timezone.now()
        payment.save()
    else:
        return JsonResponse({'error': 'No payment found for this order'}, status=400)

    Transaction.objects.filter(order=order).delete()

    return redirect('http://localhost:4200/success_payment')




# -------------------------------------------------------------------------------------

# ----------------------------------- Agent Model -------------------------------------

# from langchain.prompts import PromptTemplate
# from langchain.chains import LLMChain
# from langchain_mistralai.chat_models import ChatMistralAI
# from helpers.config import get_settings
# import json
# import re

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def ai_model(request):
#     if request.method == 'GET':
#         user = request.user
#         serializer = AIModelSerializer(user)
#         user_interests = serializer.data

#         books = Book.objects.all()
#         books_json = []
#         for book in books:
#             books_json.append({
#                 'id': book.book_id,
#                 'book_name': book.book_name,
#                 'book_about': book.brief_abstraction,
#             })

#         # Describe your schema for the LLM
#         schema_description = """
#         Book: id, book_name, author_name, category_id, price, etc.
#         User: id, username, wishlist (list of books), transactions, etc.
#         """

#         # Use LangChain's PromptTemplate
#         prompt_template = PromptTemplate(
#             input_variables=["schema", "user", "books"],
#             template="""
#         You are an assistant in a book store. Here is the current database schema:
#         {schema}

#         User data:
#         {user}

#         Available books:
#         {books}

#         Task:
#         1. Generate a short paragraph describing the user's interests and suggest relevant books (not already in their wishlist or orders).
#         2. Return a JSON with:
#           - \"descriped_paragraph\": the paragraph
#           - \"books_ids\": a list of the suggested book IDs.

#         Only output a valid JSON object.
#         """
#         )

#         prompt = prompt_template.format(
#             schema=schema_description,
#             user=json.dumps(user_interests),
#             books=json.dumps(books_json)
#         )

#         settings = get_settings()
#         api_key = settings.MISTRAL_API_KEY

#         llm = ChatMistralAI(
#             mistral_api_key=api_key,
#             model="mistral-large-latest",  # or another Mistral model
#             temperature=0.2,
#         )
#         chain = LLMChain(llm=llm, prompt=prompt_template)

#         try:
#             response = chain.run(
#                 schema=schema_description,
#                 user=json.dumps(user_interests),
#                 books=json.dumps(books_json)
#             )
#             print("LLM Response:", response)  # Debug: See what the LLM returns
#             if not response or not response.strip():
#                 print("LLM returned an empty response!")
#                 return Response({"error": "LLM returned no response"}, status=500)

#             # Remove Markdown code block if present
#             if response.strip().startswith("```"):
#                 match = re.search(r"```(?:json)?\n?(.*)```", response, re.DOTALL)
#                 if match:
#                     response = match.group(1).strip()

#             try:
#                 response_json = json.loads(response)
#             except Exception as e:
#                 print("Error parsing LLM response:", e)
#                 print("Raw LLM response:", repr(response))
#                 return Response({"error": str(e), "raw": response}, status=500)

#             # Organize summary as bullet points
#             summary = response_json.get("descriped_paragraph", "")
#             user_profile_summary = [s.strip() for s in summary.split('.') if s.strip()]

#             # Professional extraction of user interests
#             interest_keywords = [
#                 "personal development", "productivity", "history", "ancient world", "science", "fiction", "technology",
#                 "self-help", "biography", "business", "psychology", "philosophy", "romance", "fantasy"
#             ]
#             summary_lower = summary.lower()
#             user_interests = []
#             for keyword in interest_keywords:
#                 if keyword in summary_lower:
#                     user_interests.append(keyword.title())
#             user_interests = sorted(set(user_interests))

#             # Get detailed book info (limit to 3 books)
#             book_ids = response_json.get("books_ids", [])[:3]
#             books = Book.objects.filter(book_id__in=book_ids).select_related('category_id')
#             book_list = [
#                 {
#                     "id": book.book_id,
#                     "name": book.book_name,
#                     "author": book.author_name,
#                     "cover_image": book.cover_image,
#                     "category": book.category_id.category_name if book.category_id else None,
#                 }
#                 for book in books
#             ]

#             return Response({
#                 "user_interests": user_interests,
#                 "user_profile_summary": user_profile_summary,
#                 "suggested_books": book_list
#             })
#         except Exception as e:
#             import traceback
#             print(traceback.format_exc())  # Print full error to terminal
#             return Response({"error": str(e)}, status=500)
#     return Response({'error': 'Error Happened, please try again'}, status=404)


from django.conf import settings
from google import genai
from pydantic import BaseModel, Field
from typing import List, Annotated
import json


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def ai_model(request):
    if request.method == 'GET':
        user = request.user
        serializer = AIModelSerializer(user)
        user_interests = serializer.data

        books = Book.objects.all()
        books_json = []
        for book in books:
            books_json.append({
                'id': book.book_id,
                'book_name': book.book_name,
                'book_about': book.brief_abstraction,
            })

        prompt = f"""
            You are an assistant in a book store. Based on the following user data and the available books, perform two tasks:

            1. Generate a short paragraph describing the user's interests and suggest relevant books. Don't mention books' names.
            2. Return a JSON with:
            - "descriped_paragraph": the paragraph
            - "books_ids": a list of the suggested book IDs.

            Note: Don't return any book that is found already in the user transaction on wishlist.

            User data:
            {json.dumps(user_interests)}

            Available books:
            {json.dumps(books_json)}

            Only output a valid JSON object.
            """

        class OutputShape(BaseModel):
            descriped_paragraph: str
            books_ids: Annotated[List[int], Field(min_items=4, max_items=4)]

        try:
            
            client = genai.Client(api_key=settings.GEMINI_API_KEY)
            
            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
                config={
                    'response_mime_type': 'application/json',
                    'response_schema': OutputShape,
                },  
            )
            

            return Response({
                "paragraph": response.parsed.descriped_paragraph,
                "suggested_books": response.parsed.books_ids
            })
        
        except Exception as e:
            return Response({"error": str(e)}, status=500)
    return Response({'error': 'Error Happened, please try again'}, status=404)



# -------------------------------------------------------------------------------------




# -------------------- Notes ----------------------- #
# - 1 - With generic-class-based-views I can make functions
# for creating (perform_create(self, serializer)), updating
# (perofrm_update(self, serializer)) 
