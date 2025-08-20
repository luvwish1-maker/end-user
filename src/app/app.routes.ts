import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { OrderListSummaryComponent } from './components/order-list-summary/order-list-summary.component';
import { OrderPriceSummaryComponent } from './components/order-price-summary/order-price-summary.component';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductsComponent },
    { path: 'products/details/:id', component: ProductDetailsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'orderlistsummary', component: OrderListSummaryComponent },
    { path: 'orderpricesummary', component: OrderPriceSummaryComponent }
];
