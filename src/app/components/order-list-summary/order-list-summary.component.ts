import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../products/service/products.service';
import { ProfileService } from '../profile/service/profile.service';

@Component({
  selector: 'app-order-list-summary',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './order-list-summary.component.html',
  styleUrl: './order-list-summary.component.css'
})
export class OrderListSummaryComponent implements OnInit {
  orderList: any = []

  address = {
    address: "216 St Paul's Rd, London N1 2LL, UK UD 44-784232"
  }

  constructor(
    private service: ProductsService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.loadOrders()
    this.loadAddresses()
  }

  loadOrders() {
    this.service.getCart().subscribe({
      next: (res: any) => {

        this.orderList = (res.data || []).map((item: any) => {
          const prod = item.product || null;

          if (!prod) {
            return {
              ...item,
              name: 'Product Unavailable',
              discountedPrice: 0,
              actualPrice: 0,
              stockCount: 0,
              img: '/assets/images/no-image.png',
              quantity: item.quantity || 1,
              unavailable: true
            };
          }

          const mainImage = (prod.images && prod.images.length > 0)
            ? prod.images.find((img: any) => img.isMain) || prod.images[0]
            : null;

          return {
            ...item,
            ...prod,
            img: mainImage?.url || '/assets/images/no-image.png',
            quantity: item.quantity || 1,
            unavailable: false
          };
        });
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  loadAddresses() {
    this.profileService.getAddresses().subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  getStars(rating: number, index: number): string {
    if (index < Math.floor(rating)) return 'bi-star-fill';
    if (index < rating) return 'bi-star-half';
    return 'bi-star';
  }
}
