import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import { Product, Result } from "./product";
import { ProductData } from "./product-data";
import { HttpErrorService } from "../utilities/http-error.service";
import { ReviewService } from "../reviews/review.service";
import { Review } from "../reviews/review";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsUrl = "api/products";
  private errorService = inject(HttpErrorService);
  private reviewServie = inject(ReviewService);

  private productSelectedSubject = new BehaviorSubject<number | undefined>(undefined);
  readonly productSelected$ = this.productSelectedSubject.asObservable();
  selectedProductId = signal<number | undefined>(undefined);//converting BehaviorSubject to signal

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

  //#region Get Products with combineLatest and htp get
  //this part will do the same thing as declarative approach

  //general approach
  //commented out for error handling sample
  // private products$ = this.http.get<Product[]>(this.productsUrl).pipe(
  //   // tap(() => console.log('In http.get pipeline'),
  //   tap((p) => console.log(JSON.stringify(p))), //for caching mechanism
  //   shareReplay(1), //1 is buffer size we only need to emit once products cause it's not changing
  //   //we need to take care where we add a shareReplay in the pipeline
  //   //Before: precossed before caching the data
  //   //After: Re-executed for each subscription
  //   //and we need to clear the cache at some point (fluidity of data, user's behavior, on a time interval, allow user to control when data is refreshed, getting fresh data on update operations)
  //   tap(() => console.log("After shareReplay")),
  //   catchError((e) => this.handleError(e))
  // );

  private productsResult$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      map(p => ({ data: p } as Result<Product[]>)),
      tap(p => console.log(JSON.stringify(p))),
      shareReplay(1),
      catchError(err => of({ data: [], error: this.errorService.formatError(err)} as Result<Product[]>))
  );
    

  // we converted observable (products$) to signal and changed it as private
  //products = toSignal(this.products$, { initialValue: [] as Product[] });
  private productsResult = toSignal(this.productsResult$,{ initialValue:  ({ data: [] } as Result<Product[]>) });
  products = computed(() => this.productsResult().data);
  productsError = computed(() => this.productsResult().error);
  
  //to get api error
  // products = computed(() => {
  //   try {
  //     return toSignal(this.products$, { initialValue: [] as Product [] })();
  //   } catch (error) {
  //     return [] as Product[];
  //   }
  // });

  //http get -> slower than combineLatests
  readonly product$ = this.productSelected$.pipe(
    filter(Boolean),
    switchMap((id) => {
      const productUrl = this.productsUrl + "/" + id;

      return this.http.get<Product>(productUrl).pipe(
        tap(() => console.log("In http.get by id pipeline")),
        switchMap((product) => this.getProductWithReviews(product)),
        catchError((err) => this.handleError(err))
      );
    })
  ); //declarative getProduct

  //to use this part change name to products$ instead of product1$
  // product$1 = combineLatest([this.productSelected$, this.products$]).pipe(
  //   map(([selectedProductId, products]) =>
  //     products.find((product) => product.id === selectedProductId)
  //   ),
  //   filter(Boolean),
  //   switchMap((product) => this.getProductWithReviews(product)),
  //   catchError((err) => this.handleError(err))
  // );
  //#endregion

  // getProduct(id: number): Observable<Product> {
  //   const productUrl = this.productsUrl + "/" + id;

  //   return this.http.get<Product>(productUrl).pipe(
  //     tap(() => console.log("In http.get by id pipeline")),
  //     switchMap((product) => this.getProductWithReviews(product)),
  //     catchError((err) => this.handleError(err))
  //   );
  // }

  productSelected(selectedProductId: number): void {
    this.productSelectedSubject.next(selectedProductId);
    //when user selects any product we emit a next notification from that subject to any subscribers.
    this.selectedProductId.set(selectedProductId);//set signal
  }

  /*
concatMap: waits for each inner observable to complete before processing the next one
mergeMap: processes inner observables in parallel and merges the result
switchMap: unsubscribes from the prior inner observable and switches to the new one
*/
  private getProductWithReviews(product: Product): Observable<Product> {
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewServie.getReviewUrl(product.id))
        .pipe(map((reviews) => ({ ...product, reviews } as Product)));
    } else {
      return of(product); //because only a product is not an observable
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    //Observable does not emit anything in here
    const formattedMessage = this.errorService.formatError(err);
    //return throwError(() => formattedMessage);
    throw formattedMessage;
  }
}
