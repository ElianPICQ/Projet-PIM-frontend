import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StockPageProduct,ProductPageProduct } from '../interfaces/productsInterface';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private readonly StockUrl = environment.API_URL + 'stock/';

  constructor(private http: HttpClient) {}

  getStock(): Observable<StockPageProduct[]> {
    return this.http.get<StockPageProduct[]>(this.StockUrl);
  }

  addStock(products: ProductPageProduct[]): Observable<ProductPageProduct[]> {
    return this.http.post<ProductPageProduct[]>(this.StockUrl + "add/", { products })
  }

  removeStock(products: ProductPageProduct[]): Observable<StockPageProduct[]> {
    return this.http.post<StockPageProduct[]>(this.StockUrl + "remove/", { products })
  }

  deleteStock(id: number): Observable<StockPageProduct> {
    return this.http.post<StockPageProduct>(this.StockUrl + "delete/", { id });
  }
}