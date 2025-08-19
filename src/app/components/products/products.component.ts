import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{
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
      quantity: 1
    },
    {
      id: 2,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
      quantity: 1
    },
    {
      id: 3,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
      quantity: 1
    },
    {
      id: 4,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
      quantity: 1
    },
    {
      id: 5,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
      quantity: 1
    },
    {
      id: 6,
      img: '/product.png',
      name: 'Period kit + Pain relief patch Combo',
      price: '2499',
      originalPrice: '4999',
      stock: '25',
      quantity: 1
    },
  ]

  ngOnInit() {
  this.products.forEach(product => product.quantity = 1);
}

  increaseQty(product: any) {
    if (!product.quantity) product.quantity = 1;
    if (product.quantity < product.stock) product.quantity++;
  }

  decreaseQty(product: any) {
    if (!product.quantity) product.quantity = 1;
    if (product.quantity > 1) product.quantity--;
  }
}
