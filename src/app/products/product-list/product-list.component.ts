import { Component, inject } from "@angular/core";

import { NgIf, NgFor, NgClass, AsyncPipe } from "@angular/common";
import { ProductDetailComponent } from "../product-detail/product-detail.component";
import { ProductService } from "../product.service";
import { Subscription } from "rxjs";

@Component({
  selector: "pm-product-list",
  templateUrl: "./product-list.component.html",
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent],
})
export class ProductListComponent {
  pageTitle = "Products";
  sub!: Subscription;
  subProduct!: Subscription;

  private productService = inject(ProductService);
  // Products

  products = this.productService.products;
  errorMessage = this.productService.productsError;

  selectedProductId = this.productService.selectedProductId;

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
  }
}