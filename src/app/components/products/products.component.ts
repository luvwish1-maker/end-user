import { Component } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
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

  products = [
    {
      id: 1,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
    },
    {
      id: 2,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
    },
    {
      id: 3,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
    },
    {
      id: 4,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
    },
    {
      id: 5,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
    },
    {
      id: 6,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
    },
  ]
}
