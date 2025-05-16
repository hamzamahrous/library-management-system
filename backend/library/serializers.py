from rest_framework import serializers
from .models import *


#---------------- Changing and reseting password serializers --------
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)


class ResetPasswordEmailSerilaizer(serializers.Serializer):
    email=serializers.EmailField(required=True)

# ------------------------------- ------------------------------------

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
    wishlist_items = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'transactions', 'orders', 'first_name', 'last_name', 'wishlist_items']  # Excluding password
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user



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

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price can't be less than zero")
        return value



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'




class WishlistSerializer(serializers.ModelSerializer):
    # user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Wishlist
        fields = ['wishlist_id', 'book']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    
    def update(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().update(validated_data)





class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    rating = serializers.FloatField(
    min_value=0.0,
    max_value=5.0,
    error_messages={
        'min_value': 'Rating must be at least 0.',
        'max_value': 'Rating cannot be more than 5.'
    })

    class Meta:
        model = Review
        fields = '__all__'

    def validate_rating(self, value):
        """
        Making sure 0 =< rating <= 5
        """
        if value < 0 or value > 5:
            return serializers.ValidationError("Rating must be between 0 and 5")
        return value


    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)




class OrderSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # Assuming 'owner' is a ForeignKey to User
    transactions = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        extra_kwargs = {'total_price': {'read_only': True},
        }

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
        



class TransactionSerializer(serializers.ModelSerializer):
    # book_price = serializers.ReadOnlyField(source='book.price', default='Not Specified')
    # book_name = serializers.ReadOnlyField(source='book.book_name', default = 'Not Specified')
    # user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Transaction
        fields = ['transaction_id', 'order', 'book', 'quantity']
        # extra_kwargs = {
        #     'user' : {'read_only' : True}
        # }
        

    # def get_book_price(self, obj):
    #     return obj.book.price if obj.book else None
    
    # def get_order(self, obj):
    #     return obj.order if obj.order.user == self.user else None
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
    




class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'



