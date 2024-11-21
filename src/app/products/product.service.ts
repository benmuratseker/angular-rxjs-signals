import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, of, tap, throwError } from "rxjs";
import { Product } from "./product";
import { ProductData } from "./product-data";
import { HttpErrorService } from "../utilities/http-error.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private productsUrl = "api/productss";
  private errorService = inject(HttpErrorService);

  //constructor(private http: HttpClient) {}

  private http = inject(HttpClient);

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      tap(() => console.log("Inc http.get pipeline")),
      // catchError((err) => {
      //   console.error(err);
      //   return of(ProductData.products);
      // })
      catchError(err => this.handleError(err))
    );
  }

  getProduct(id: number): Observable<Product> {
    const productUrl = this.productsUrl + "/" + id;

    return this.http
      .get<Product>(productUrl)
      .pipe(tap(() => console.log("In http.get by id pipeline")));
  }

  private handleError(err: HttpErrorResponse): Observable<never> { //Observable does not emit anything in here
    const formattedMessage = this.errorService.formatError(err);
    //return throwError(() => formattedMessage);
    throw formattedMessage;
  }
}
