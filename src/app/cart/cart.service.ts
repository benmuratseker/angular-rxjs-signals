import { computed, effect, Injectable, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => this.cartItems()
    .reduce((accQty, item) => accQty + item.quantity, 0)//0 is initial value for accumulation
  );

  eLength = effect(() => console.log('Cart array length:', this.cartItems().length))
  
  addToCart(product: Product):void {
    //this.cartItems().push({ product, quantity: 1});
    //we added to cart item list but we need to notify wit set or update methods
    this.cartItems.update(items => [...items, {product, quantity:1}]);
  }
}
