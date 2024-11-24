import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, switchMap, tap, throwError } from "rxjs";
import { Product } from "./product";
import { ProductData } from "./product-data";
import { HttpErrorService } from "../utilities/http-error.service";
import { ReviewService } from "../reviews/review.service";
import { Review } from "../reviews/review";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsUrl = "api/products";
  private errorService = inject(HttpErrorService);
  private reviewServie = inject(ReviewService);

  //constructor(private http: HttpClient) {}

  private http = inject(HttpClient);

  // getProducts(): Observable<Product[]> {
  //   return this.http.get<Product[]>(this.productsUrl).pipe(
  //     tap(() => console.log("Inc http.get pipeline")),
  //     // catchError((err) => {
  //     //   console.error(err);
  //     //   return of(ProductData.products);
  //     // })
  //     catchError(err => this.handleError(err))
  //   );
  // }

    //this part will do the same thing as declarative approach
    readonly products$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      tap(() => console.log('In http.get pipeline'),
    catchError( e => this.handleError(e)))
    );

  getProduct(id: number): Observable<Product> {
    const productUrl = this.productsUrl + "/" + id;

    return this.http
      .get<Product>(productUrl)
      .pipe(
        tap(() => console.log("In http.get by id pipeline")),
        switchMap(product => this.getProductWithReviews(product)),
        catchError(err => this.handleError(err))
      );
  }



/*
concatMap: waits for each inner observable to complete before processing the next one
mergeMap: processes inner observables in parallel and merges the result
switchMap: unsubscribes from the prior inner observable and switches to the new one
*/
  private getProductWithReviews(product: Product) : Observable<Product> {
    if(product.hasReviews) {
      return this.http.get<Review[]>(this.reviewServie.getReviewUrl(product.id))
        .pipe(
          map(reviews => ({ ...product, reviews } as Product) )
        )
    }
    else {
      return of(product);//because only a product is not an observable
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> { //Observable does not emit anything in here
    const formattedMessage = this.errorService.formatError(err);
    //return throwError(() => formattedMessage);
    throw formattedMessage;
  }
}
