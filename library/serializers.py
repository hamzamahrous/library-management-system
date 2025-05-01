from rest_framework import serializers
from .models import *



class UserSerializer(serializers.ModelSerializer):
    # transactions = serializers.ReadOnlyField(view_name='transaction-list')
    # orders = serializers.ReadOnlyField(view_name='order-list')

    
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True,}}

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class UserListSerializer(serializers.ModelSerializer):
    transactions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    orders = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'transactions', 'orders']  # Excluding password



class BookSerializer(serializers.ModelSerializer):
    publishing_date = serializers.DateField(format="%Y-%m-%d")  # Explicitly specify the format
    # user = serializers.ReadOnlyField(source='publisher.username')  # Assuming 'owner' is a ForeignKey to User
    url = serializers.HyperlinkedIdentityField(
        view_name= 'book-detail',
        lookup_field = 'pk'
    )

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
    transactions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        extra_kwargs = {'total_price': {'read_only': True},
        }
        




class TransactionSerializer(serializers.ModelSerializer):
    book_price = serializers.ReadOnlyField(source='book.price', default='Not Specified')
    book_name = serializers.ReadOnlyField(source='book.book_name', default = 'Not Specified')

    class Meta:
        model = Transaction
        fields = ['order', 'book', 'book_name', 'book_price', 'user']

    def get_book_price(self, obj):
        return obj.book.price if obj.book else None
    




class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'



