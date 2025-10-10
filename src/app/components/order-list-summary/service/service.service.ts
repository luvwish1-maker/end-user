import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private BaseUrl = `${environment.apiUrl}/payments`

  constructor(
    private http: HttpClient
  ) { }

  createOrder(itm: any) {
    return this.http.post(`${this.BaseUrl}/create-order`, itm)
  }
}
