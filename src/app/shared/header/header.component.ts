import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/interceptor/auth.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from '../../components/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  login() {
    this.router.navigate(['/login'])
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }
}
