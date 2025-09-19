import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private BaseUrl = `${environment.apiUrl}/auth`
  private BankUrl = `${environment.apiUrl}/bank-details`

  constructor(
    private http: HttpClient
  ) { }

  getProfile() {
    return this.http.get(`${this.BaseUrl}/customer/profile`)
  }

  createProfile(itm: any) {
    const formData = this.buildFormData(itm);
    return this.http.post(`${this.BaseUrl}/profile`, formData);
  }


  updateProfile(itm: any) {
    const formData = this.buildFormData(itm);
    return this.http.patch(`${this.BaseUrl}/profile`, formData);
  }

  updatePassword(itm: any) {
    return this.http.get(`${this.BaseUrl}/change-password`, itm)
  }

  private buildFormData(obj: any): FormData {
    const formData = new FormData();
    Object.keys(obj).forEach(key => {
      if (obj[key] !== null && obj[key] !== undefined) {
        formData.append(key, obj[key]);
      }
    });
    return formData;
  }

  addBankDetails(itm: any) {
    return this.http.post(`${this.BankUrl}`, itm)
  }

  getBankDetails() {
    return this.http.get(`${this.BankUrl}`)
  }

  updateBankDetails(itm: any) {
    return this.http.patch(`${this.BankUrl}/`, itm)
  }

  deleteBankDetails(id: string) {
    return this.http.delete(`${this.BankUrl}/${id}`)
  }
}
