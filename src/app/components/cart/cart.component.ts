import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products/service/products.service';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../shared/alert/service/alert.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, HeaderComponent, FooterComponent, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  allProducts: any[] = [];
  fullObjects: any[] = [];
  isLoading: boolean = false;
  loadingUpdate: { [key: string]: boolean } = {};
  loadingRemove: { [key: string]: boolean } = {};

  constructor(
    private service: ProductsService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.loadCart()
  }

  loadCart() {
    this.isLoading = true;
    this.service.getCart().subscribe({
      next: (res: any) => {
        this.fullObjects = res.data;

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
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
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
    const cartItem = this.fullObjects.find(item => item.productId === product.productId);
    if (!cartItem) return;

    this.loadingUpdate[product.productId] = true;

    this.service.updateCartItem({ productId:cartItem.productId, quantity: product.quantity }).subscribe({
      next: () => {
        this.alertService.showAlert({
          message: 'Cart updated successfully',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
        this.loadingUpdate[product.productId] = false;
      },
      error: (err) => {
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
        this.loadingUpdate[product.productId] = false;
      }
    });
  }

  removeCart(product: any) {
    const cartItem = this.fullObjects.find(item => item.productId === product.productId);
    if (!cartItem) return;

    this.loadingRemove[product.productId] = true;

    this.service.removeCartItem(cartItem.id, {}).subscribe({
      next: () => {
        this.alertService.showAlert({
          message: 'Item removed from cart',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });

        // this.fullObjects = this.fullObjects.filter(itm => itm.productId !== product.productId);
        // this.allProducts = this.allProducts.filter(itm => itm.productId !== product.productId);
        this.loadingRemove[product.productId] = false;
        this.loadCart()
      },
      error: (err) => {
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
        this.loadingRemove[product.productId] = false;
      }
    });
  }

}
