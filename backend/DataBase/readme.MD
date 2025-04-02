## About ER Diagram :
#### User

    Can Do Many Things --> 

    Makes Orders
    Writes Reviews
    Creates Wishlist
    Performs Transactions


#### Book

    Belongs to Categories
    Has Wishlist
    Has Reviews
    Appears in Orders
    Appears in Transactions


#### Order

    Includes Books
    Is Paid Using Payment Method


#### Transaction

    Performed by User
    Includes Books
    Linked to Order

#### Category

    Has Books

------------------------------------------------------------------------------
## About Stored Procedures :
  ### 1- User Management
      AddUser – Adds a new user.
      DeleteUser – Deletes a user by ID.
      ResetUserPassword – Updates the user's password.
      GetMostActiveUsers – Retrieves the most active users.

  ### 2- Book & Wishlist Management
      AddBook – Inserts a new book.
      GetAvailableBooks – Fetches books in stock.
      GetTopSellingBooks – Retrieves the best-selling books.
      SearchAboutBook – Searches for books by name.
      GetLatestBooks – Retrieves recently added books.
      GetBooksByCategory – Fetches books by category.
      AddToWishlist – Adds a book to a wishlist.
      RemoveFromWishlist – Removes a book from a wishlist.
      GetUserWishlist – Retrieves all books in a user’s wishlist.
    
  ### 3- Order & Transaction Processing
      MakeOrder – Creates a new order.
      UpdateOrderStatus – Changes the order status.
      GetUserOrders – Retrieves all orders for a user.
      DeleteOrder – Deletes an order.
      GetUnpaidOrders – Fetches all unpaid orders.

  ### 3- Payment & Transactions
      RecordPayment – Logs a new payment.
      GetPaymentDetails – Retrieves payment information.
      GetTotalSales – Retrieves the total revenue.

  ### 4- ProcessPayment – Handles payment processing.
      Review Management
      AddReview – Adds a book review.
      GetBookReviews – Retrieves reviews for a book.

  ### 5- Reports & Statistics
      GetTotalRevenue – Retrieves the total revenue.
      GetPopularCategories – Finds the most popular categories.
      GetUserPurchaseHistory – Retrieves user purchase history.
      GetLowStockBooks – Finds books with low stock.
      UpdateBookStock – Updates book stock quantity.