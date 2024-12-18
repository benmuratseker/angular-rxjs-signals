import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  computed,
  inject,
} from "@angular/core";

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from "@angular/common";
import { Product } from "../product";
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { ProductService } from "../product.service";
import { CartService } from "src/app/cart/cart.service";

@Component({
  selector: "pm-product-detail",
  templateUrl: "./product-detail.component.html",
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, AsyncPipe],
})
// export class ProductDetailComponent implements OnChanges, OnDestroy {
  export class ProductDetailComponent {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  //@Input() productId: number = 0; //gets data when we select a product from product-list component
  //errorMessage = "";

  // Product to display
    product = this.productService.product;
    errorMessage = this.productService.productError;
  //product: Product | null = null;
  // product$ = this.productService.product$
  // .pipe(
  //   catchError(err => {
  //     this.errorMessage = err;
  //   return EMPTY;
  //   })
  // );
  

  //subProduct!: Subscription;

  // Set the page title
  // pageTitle = this.product
  //   ? `Product Detail for: ${this.product.productName}`
  //   : "Product Detail";
  //pageTitle = "Product Detail";
  pageTitle = computed(() =>
      this.product()
      ? `Product Detail fo: ${this.product()?.productName}`
      : 'Product Detail');

  // ngOnChanges(changes: SimpleChanges): void {
  //   const id = changes["productId"].currentValue; //from here -> <pm-product-detail [productId]="selectedProductId"/>

  //   if (id) {
  //     this.subProduct = this.productService
  //       .getProduct(id)
  //       .pipe(
  //         tap(() => console.log("In product detail component")),
  //         catchError(err => {
  //           this.errorMessage = err;
  //         return EMPTY;
  //         })
  //       ).subscribe(
  //         product => this.product = product
  //       );
  //   }
  // }

  // ngOnDestroy(): void {
  //   if (this.subProduct) {
  //     this.subProduct.unsubscribe();
  //   }
  // }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
