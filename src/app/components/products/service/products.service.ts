import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private BaseUrl = `${environment.apiUrl}/products`
  private CartUrl = `${environment.apiUrl}/cart`
  private WishUrl = `${environment.apiUrl}/wishlist`

  constructor(
    private http: HttpClient
  ) { }

  getProducts(params?: any) {
    return this.http.get(`${this.BaseUrl}`, { params })
  }

  getProductByID(id: string) {
    return this.http.get(`${this.BaseUrl}/${id}`)
  }

  addToCart(itm: any) {
    return this.http.post(`${this.CartUrl}/add`, itm)
  }

  getCart() {
    return this.http.get(`${this.CartUrl}`)
  }

  removeCartItem(id: string, itm: any) {
    return this.http.patch(`${this.CartUrl}/remove-from-cart/${id}`, itm)
  }

  updateCartItem(id: string, itm: any) {
    return this.http.patch(`${this.CartUrl}/add-to-cart/${id}`, itm)
  }

  addToWishList(itm: any) {
    return this.http.post(`${this.WishUrl}`, itm)
  }

  getWishList() {
    return this.http.get(`${this.WishUrl}`)
  }

  removeFromWishList(id: string) {
    return this.http.delete(`${this.WishUrl}/?id=${id}`)
  }
}
