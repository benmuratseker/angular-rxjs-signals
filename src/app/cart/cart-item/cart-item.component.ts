import { Component, computed, inject, Input, signal } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CartItem } from '../cart';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-item',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, NgFor, NgIf],
  templateUrl: './cart-item.component.html'
})
export class CartItemComponent {

  // @Input({ required: true }) cartItem!: CartItem;
  @Input({ required: true }) set cartItem(ci: CartItem) { //2 set the signal in the Input property setter
    this.item.set(ci);
  }
  private cartService = inject(CartService);

  item = signal<CartItem>(undefined!);//1 create a signal for the cart item

  

  // Quantity available (hard-coded to 8)
  // Mapped to an array from 1-8
  qtyArr = [...Array(8).keys()].map(x => x + 1);

  // Calculate the extended price
  //exPrice = this.cartItem?.quantity * this.cartItem?.product.price;
  exPrice = computed(() => this.item().quantity * this.item().product.price);//3 declare a computed signal for the extended price

  onQuantitySelected(quantity: number): void {
    // this.cartService.updateQuantity(this.cartItem, Number(quantity));
    this.cartService.updateQuantity(this.item(), Number(quantity));
  }

  removeFromCart(): void {
    // this.cartService.removeFromCart(this.cartItem);
    this.cartService.removeFromCart(this.item());
  }
}
