import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class CoingeckoService {
  constructor(private http: HttpClient) {}

  apiUrl = 'https://api.coingecko.com/api/v3';

  getAllCoins() {
    return this.http.get(`${this.apiUrl}/coins/list`).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(err);
      })
    );
  }

  getCoins(coins: string) {
    return this.http
      .get(`${this.apiUrl}/simple/price?ids=${coins}&vs_currencies=usd`)
      .pipe(
        catchError((err) => {
          console.error(err);
          return throwError(err);
        })
      );
  }
}
