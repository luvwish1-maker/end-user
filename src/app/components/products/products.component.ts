import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from './service/products.service';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/alert/service/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../core/interceptor/auth.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  categories = [
    {
      id: 1,
      img: '/skin.jpg',
      label: 'Sanitary Pads'
    },
    {
      id: 2,
      img: '/skin.jpg',
      label: 'Hygine Products'
    },
    {
      id: 3,
      img: '/skin.jpg',
      label: 'Body Lotions'
    },
    {
      id: 4,
      img: '/skin.jpg',
      label: 'Makeup'
    },
    {
      id: 5,
      img: '/skin.jpg',
      label: 'Skin Care'
    },
  ]

  allProducts: any[] = [];
  page = 1;
  limit = 8;
  totalPages = 1;
  totalPagesArray: number[] = [];
  total = 0;
  isLoading = false;

  constructor(
    private service: ProductsService,
    private router: Router,
    private alertService: AlertService,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts() {
    this.isLoading = true;
    const params = {
      limit: this.limit,
      page: this.page
    };

    this.service.getProducts(params).subscribe({
      next: (res: any) => {
        this.allProducts = (res.data.data || []).map((product: any) => {
          const mainImage = (product.images && product.images.length > 0)
            ? product.images.find((img: any) => img.isMain) || product.images[0]
            : null;

          return {
            ...product,
            img: mainImage?.url || '/assets/images/no-image.png',
            quantity: 1
          };
        });

        this.total = res.data.meta?.total || 0;
        this.totalPages = res.data.meta?.totalPages || 1;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  changePage(p: number) {
    if (p < 1 || p > this.totalPages) return;
    this.page = p;
    this.loadProducts();
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

  addToCart(id: string, quantity: number) {

    if (!this.authService.isLoggedIn()) {
      this.alertService.showAlert({
        message: 'Please log in to add items to your cart',
        type: 'warning',
        autoDismiss: true,
        duration: 4000
      });

      const buttonElement = document.activeElement as HTMLElement;
      buttonElement.blur();

      const modalRef = this.modalService.open(LoginComponent, { centered: true, size: 'md' });
      modalRef.componentInstance.isModal = true

      modalRef.result.then((result) => {
        if (result) {
          this.addToCart(id, quantity);
        }
      }).catch(() => { });

      return;
    }

    const itm = {
      productId: id,
      quantity: quantity
    }

    this.service.addToCart(itm).subscribe({
      next: (res: any) => {
        this.alertService.showAlert({
          message: 'Added to cart',
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
    })

  }

  toggleWishlist(product: any) {
    if (!this.authService.isLoggedIn()) {
      this.alertService.showAlert({
        message: 'Please log in to manage wishlist',
        type: 'warning',
        autoDismiss: true,
        duration: 4000
      });

      const modalRef = this.modalService.open(LoginComponent, { centered: true, size: 'md' });
      modalRef.componentInstance.isModal = true;
      return;
    }    

    if (product.isWishlisted) {
      this.service.removeFromWishList(product.id).subscribe({
        next: () => {
          product.isWishlisted = false;
          this.alertService.showAlert({
            message: 'Removed from wishlist',
            type: 'info',
            autoDismiss: true,
            duration: 3000
          });
        },
        error: (err) => {
          console.error(err);
        }
      });
      const itm = { productId: product.id };
      this.service.addToWishList(itm).subscribe({
        next: () => {
          product.isWishlisted = true;
          this.alertService.showAlert({
            message: 'Added to wishlist',
            type: 'success',
            autoDismiss: true,
            duration: 3000
          });
        },
        error: (err) => {
          console.error(err);
        }
      });
    }
  }


}