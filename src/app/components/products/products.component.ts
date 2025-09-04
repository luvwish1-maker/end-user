import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService } from './service/products.service';
import { Router } from '@angular/router';

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

  constructor(
    private service: ProductsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProducts()
  }

  loadProducts() {
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

}