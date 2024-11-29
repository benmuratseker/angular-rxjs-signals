import { Component, inject, OnDestroy, OnInit } from "@angular/core";

import { NgIf, NgFor, NgClass, AsyncPipe } from "@angular/common";
import { Product } from "../product";
import { ProductDetailComponent } from "../product-detail/product-detail.component";
import { ProductService } from "../product.service";
import { catchError, EMPTY, Subscription, tap } from "rxjs";

@Component({
  selector: "pm-product-list",
  templateUrl: "./product-list.component.html",
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe],
})
// export class ProductListComponent implements OnInit, OnDestroy {
//we don't need implementations
  export class ProductListComponent {
  pageTitle = "Products";
  //errorMessage = "";
  sub!: Subscription;
  subProduct!: Subscription;

  private productService = inject(ProductService);
  // Products
  //products: Product[] = [];

  // readonly products$ = this.productService.products$
  // .pipe(
  //   // tap(() => console.log("In component pipeline")), // for cache mechanism
  //   catchError(err => {
  //   this.errorMessage = err;
  //   return EMPTY
  //   })
  // );//because of products$ converted to signal
  // ** because we don't use subscribe we don't need onInit and destroy
    
  products = this.productService.products;
  errorMessage = this.productService.productsError;



  // Selected product id to highlight the entry
  //selectedProductId: number = 0;
  readonly selectedProductId$ = this.productService.productSelected$;//bind from template to a component

  // ngOnInit(): void {
  //   this.sub = this.productService
  //     //.getProducts()//related to declarative update on product service
  //     .products$
  //     .pipe(
  //       tap(() => console.log("In component pipeline")),
  //       catchError(err => {
  //       this.errorMessage = err;
  //       return EMPTY
  //       })
  //     //to send error message to errorMessage on html
  //     // .subscribe({
  //     //   next: products => {
  //     //     this.products = products;
  //     //     console.log(this.products);
  //     //   },
  //     //   error: err => this.errorMessage = err
  //     // });
  //     ).subscribe((products) => {
  //       this.products = products;
  //       console.log(this.products);
  //     });
  // }

  // ngOnDestroy(): void {
  //   this.sub.unsubscribe();
  // }

  onSelected(productId: number): void {
    //this.selectedProductId = productId;
    this.productService.productSelected(productId);
  }
}
