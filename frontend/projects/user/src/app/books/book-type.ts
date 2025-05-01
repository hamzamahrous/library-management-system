export type Book = {
  book_id: number;
  publishing_date: string; // ISO date format (e.g., "1937-09-21")
  book_name: string;
  author_name: string;
  publisher: string;
  book_language: string;
  pages_num: number;
  price: string;
  num_of_sells: number;
  stock_quantity: number;
  evaluation: number; // Rating from 1 to 5
  brief_abstraction: string;
  long_abstraction: string;
  cover_image: string; // URL to the cover image
  category_id: number;
};
