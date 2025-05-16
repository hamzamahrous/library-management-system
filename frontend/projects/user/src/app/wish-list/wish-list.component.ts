import { Component, inject } from '@angular/core';
import { Book } from '../books/book-type';
import { BooksService } from '../books/services/books.service';
import { WishList, WishListServiceService } from './wish-list-service.service';
import { WishListItemComponent } from './wish-list-item/wish-list-item.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  imports: [WishListItemComponent, RouterModule],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css',
})
export class WishListComponent {
  private wishListServiceService = inject(WishListServiceService);
  private booksService = inject(BooksService);
  wishListItems?: WishList[];
  books: Book[] = [];

  ngOnInit(): void {
    this.loadItemsFromWishList();
  }

  loadItemsFromWishList() {
    this.wishListServiceService.loadWishList().subscribe({
      next: () => {
        this.wishListServiceService.getWishList().subscribe({
          next: (wishData) => {
            this.wishListItems = wishData;
            this.loadBooks();
          },
        });
      },

      error: (err) => {
        console.error('Failed to load wish list items', err);
      },
    });
  }

  loadBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (res) => {
        this.books = res;
      },
    });
  }

  handleItemDeleted({ bookId }: { bookId: number }) {
    this.wishListItems = this.wishListItems?.filter(
      (item) => item.book !== bookId
    );
  }
}
