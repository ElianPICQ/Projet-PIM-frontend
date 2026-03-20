import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Product } from '../interfaces/productsInterface';
import { DashboardData } from '../interfaces/dashboardInterface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly dashboardUrl = environment.API_URL + 'dashboard/';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(this.dashboardUrl);
  }
}