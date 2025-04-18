from rest_framework import serializers
from .models import *



class UserSerializer(serializers.ModelSerializer):
    transactions = serializers.HyperlinkedRelatedField(many=True, view_name='transaction-list', read_only=True)
    orders = serializers.HyperlinkedRelatedField(many=True, view_name='order-list', read_only=True)

    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'transactions', 'orders']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class UserListSerializer(serializers.ModelSerializer):
    transactions = serializers.HyperlinkedRelatedField(many=True, view_name='transaction-list', read_only=True)
    orders = serializers.HyperlinkedRelatedField(many=True, view_name='order-list', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'transactions', 'orders']  # Excluding password



class BookSerializer(serializers.ModelSerializer):
    publishing_date = serializers.DateField(format="%Y-%m-%d")  # Explicitly specify the format
    # user = serializers.ReadOnlyField(source='publisher.username')  # Assuming 'owner' is a ForeignKey to User

    class Meta:
        model = Book
        fields = '__all__'



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'




class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wishlist
        fields = '__all__'





class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'




class OrderSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # Assuming 'owner' is a ForeignKey to User

    class Meta:
        model = Order
        fields = '__all__'




class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    book_price = serializers.ReadOnlyField(source='book.price')
    book_name = serializers.ReadOnlyField(source='book.book_name')

    class Meta:
        model = Transaction
        fields = ['order', 'book', 'book_name', 'book_price', 'user']

    def get_book_price(self, obj):
        return obj.book.price if obj.book else None
    




class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'



