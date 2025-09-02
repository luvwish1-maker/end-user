import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private BaseUrl = `${environment.apiUrl}/products`

  constructor(
    private http: HttpClient
  ) { }

  getProducts(){
    return this.http.get(`${this.BaseUrl}`)
  }
}
