import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  details = {
    id: 1,
    images: [
      '/product.png',
      '/product.png',
      '/product.png',
      '/product.png',
      '/product.png',
    ],
    name: 'Period kit + Pain relief patch Combo',
    price: '1500',
    originalPrice: '2999',
    discount: '50%',
    type: 'Period Essential',
    rating: {
      score: 4,
      users: '56890'
    },
    details: 'Each kit includes five sanitary pads, a 25ml sanitizer, and five toilet sheets for hygiene on the go. Disposable bags and tissues ensure easy waste management and added convenience.A sweet treat of dark chocolate is included to uplift your mood during your cycle.We also offer a hygiene pack variant with a pad, sanitizer, disposable bag, tissue, and chocolate. Available in two sizes and flavors, our packs support daily hygiene and boost confidence.'
  }

  stars = [1, 2, 3, 4, 5];

}
