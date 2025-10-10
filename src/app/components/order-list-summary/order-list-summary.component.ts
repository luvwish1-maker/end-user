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
  orderList: any[] = [];
  addresses: any[] = [];
  selectedAddress: any = null;
  couponCode: string = '';
  couponDiscount: number = 0;
  couponError: string = '';

  constructor(
    private service: ProductsService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.loadOrders();
    this.loadAddresses();
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
              img: '/assets/images/no-image.png',
              quantity: item.quantity || 1,
              unavailable: true
            };
          }

          const mainImage = (prod.images && prod.images.length)
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

        // Auto-select default address if available
        if (!this.selectedAddress && this.addresses.length) {
          this.selectedAddress = this.addresses.find(a => a.isDefault) || this.addresses[0];
        }
      },
      error: (err) => console.error(err)
    });
  }

  loadAddresses() {
    this.profileService.getAddresses().subscribe({
      next: (res: any) => {
        this.addresses = res.data || [];
        this.selectedAddress = this.addresses.find(a => a.isDefault) || this.addresses[0];
      },
      error: (err) => console.error(err)
    });
  }

  getStars(rating: number, index: number): string {
    if (index < Math.floor(rating)) return 'bi-star-fill';
    if (index < rating) return 'bi-star-half';
    return 'bi-star';
  }

  getDiscount(actual: number, discounted: number): number {
    return Math.round(((actual - discounted) / actual) * 100);
  }

  getTotalItems(): number {
    return this.orderList.reduce((sum, item) => sum + (item.quantity || 0), 0);
  }

  getTotalPrice(): number {
    return this.orderList.reduce((sum, item) => sum + (item.actualPrice * (item.quantity || 1)), 0);
  }

  getTotalDiscount(): number {
    return this.orderList.reduce((sum, item) => sum + ((item.actualPrice - item.discountedPrice) * (item.quantity || 1)), 0);
  }

  applyCoupon() {
    this.couponError = '';

    if (this.couponCode.toUpperCase() === 'SAVE50') {
      const totalAmount = this.getFinalAmount();
      this.couponDiscount = totalAmount * 0.1;
    } else {
      this.couponError = 'Invalid coupon code';
      this.couponDiscount = 0;
    }
  }

  getFinalAmount(): number {
    const total = this.orderList.reduce((sum, item) => sum + (item.discountedPrice * (item.quantity || 1)), 0);
    return total - this.couponDiscount;
  }
}
