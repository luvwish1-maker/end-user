import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list-summary',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './order-list-summary.component.html',
  styleUrl: './order-list-summary.component.css'
})
export class OrderListSummaryComponent {
  orderList = [
    {
      id: 1,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      rating: 4.5,
      price: '340',
      originalPrice: '540',
      discount: '33%',
      quantity: 3
    },
    {
      id: 2,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      rating: 4,
      price: '500',
      originalPrice: '540',
      discount: '43%',
      quantity: 1
    }
  ]

  address = {
    address: "216 St Paul's Rd, London N1 2LL, UK UD 44-784232"
  }

  getStars(rating: number, index: number): string {
    if (index < Math.floor(rating)) return 'bi-star-fill';
    if (index < rating) return 'bi-star-half';
    return 'bi-star';
  }
}
