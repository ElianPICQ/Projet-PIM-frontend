import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface LoginResponseSuccess {
  success: boolean,
  message: string,
  user: {
    username: string
  },
  access: string,
  refresh: string
}

interface LoginResponseError {
  success: boolean,
  message: string
}

type LoginResponse = LoginResponseSuccess | LoginResponseError

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loginUrl = environment.API_URL + 'authentication/login/';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { username, password });
  }
}
