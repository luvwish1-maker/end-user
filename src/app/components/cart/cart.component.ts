import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../products/service/products.service';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
    private router: Router
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

          console.log(prod);

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

}
