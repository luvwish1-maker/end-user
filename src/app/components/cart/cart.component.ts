import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products/service/products.service';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../shared/alert/service/alert.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  allProducts: any[] = [];

  constructor(
    private service: ProductsService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadCart()
    console.log(this.allProducts);
  }

  loadCart() {
    this.service.getCart().subscribe({
      next: (res: any) => {
        this.allProducts = (res.data || []).map((item: any) => {
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
        console.log(err);
      }
    });
  }

  increaseQty(product: any) {
    if (product.quantity < product.stockCount) {
      product.quantity++;
    }
  }

  decreaseQty(product: any) {
    if (product.quantity > 1) {
      product.quantity--;
    }
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = '/product.png';
  }

  gotoDetail(itm: any) {
    if (itm?.id) {
      this.router.navigate([`/products/details`, itm.id]);
    }
  }

  updateCart(product: any) {
    const body = { quantity: product.quantity };

    this.service.updateCartItem(product.id, body).subscribe({
      next: () => {
        this.alertService.showAlert({
          message: 'Item updated',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
      },
      error: (err) => {
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

  removeCart(product: any) {
    this.service.removeCartItem(product.id, {}).subscribe({
      next: () => {
        this.alertService.showAlert({
          message: 'Item removed from cart',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
        this.allProducts = this.allProducts.filter(p => p.id !== product.id);
      },
      error: (err) => {
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

}
