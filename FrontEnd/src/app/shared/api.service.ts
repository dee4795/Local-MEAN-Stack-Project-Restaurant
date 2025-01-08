import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { RestaurentData } from '../restaurent-dash/restaurent.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private _http: HttpClient) { }

  addRestaurent(restaurentModelObj: RestaurentData) {
    return this._http.post<any>(`${this.baseUrl}/restaurants`, restaurentModelObj).pipe(
      map((res: any) => res)
    );
  }

  postRestaurent(data: RestaurentData) {
    return this._http.post<any>(`${this.baseUrl}/restaurants`, data).pipe(
      map((res: any) => res)
    );
  }

  getRestaurent() {
    return this._http.get<any>(`${this.baseUrl}/restaurants`).pipe(
      map((res: any) => res)
    );
  }

  deleteRestaurant(id: any) {
    return this._http.delete<any>(`${this.baseUrl}/restaurants/${id}`).pipe(
      map((res: any) => res)
    );
  }

  updateRestaurant(id: any, data: RestaurentData) {
    return this._http.put<any>(`${this.baseUrl}/restaurants/${id}`, data).pipe(
      map((res: any) => res)
    );
  }
}