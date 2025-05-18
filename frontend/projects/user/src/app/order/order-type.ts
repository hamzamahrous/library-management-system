import { Time } from '@angular/common';
import { CartItem } from '../cart/cart.service';

export interface Order {
  order_id: number;
  user: string;
  transactions: CartItem[];
  total_price: number;
  order_status: string;
  shipping_address: string;
  created_at: string;
}
