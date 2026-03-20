import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Transaction {
  date: string;
  type_mouvement: string;
  original_product_id: number;
  name: string;
  category: number;
  quantity: number;
  unit: string;
  price: number;
  discount: number;
  comments: string;
  supplier: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private readonly transactionsUrl = environment.API_URL + 'distant/transactions/';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.transactionsUrl);
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.transactionsUrl, transaction);
  }
}