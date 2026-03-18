import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StockProduct } from '../interfaces/productsInterface';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private readonly StockUrl = environment.API_URL + 'stock/';

  constructor(private http: HttpClient) {}

  getStock(): Observable<StockProduct[]> {
    return this.http.get<StockProduct[]>(this.StockUrl);
  }

  addStock(products: StockProduct[]): Observable<StockProduct[]> {
    return this.http.post<StockProduct[]>(this.StockUrl + "add/", { products })
  }

  removeStock(products: StockProduct[]): Observable<StockProduct[]> {
    return this.http.post<StockProduct[]>(this.StockUrl + "remove", { products })
  }
}