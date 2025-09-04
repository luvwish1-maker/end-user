import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private BaseUrl = `${environment.apiUrl}/products`
  private CartUrl = `${environment.apiUrl}/cart`

  constructor(
    private http: HttpClient
  ) { }

  getProducts(params?:any){    
    return this.http.get(`${this.BaseUrl}`, {params})
  }

  getProductByID(id:string){
    return this.http.get(`${this.BaseUrl}/${id}`)
  }

  addToCart(itm: any){
    return this.http.post(`${this.CartUrl}/add`, itm)
  }
}
