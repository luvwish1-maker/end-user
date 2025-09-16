import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ProfileService } from './service/profile.service';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../shared/alert/service/alert.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  editMode = false;
  loading = false;
  passwordLoading = false;

  constructor(
    private service: ProfileService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.loadProfile();
    this.profileFormInit();
    this.passwordFormInit();
  }

  loadProfile() {
    this.loading = true;
    this.service.getProfile().subscribe({
      next: (res: any) => {

        this.profile = res.data;
        if (this.profile.CustomerProfile) {
          this.profileForm.patchValue(this.profile.CustomerProfile);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  profileFormInit() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      profilePicture: ['']
    });
  }

  passwordFormInit() {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  enableEdit() {
    this.editMode = true;
  }

  saveProfile() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    const payload = this.profileForm.value;

    this.service.updateProfile(payload).subscribe({
      next: (res: any) => {
        this.profile.CustomerProfile = res.data;

        this.editMode = false;
        this.loading = false;
        this.alertService.showAlert({
          message: 'Profile updated successfully',
          type: 'success',
          autoDismiss: true,
          duration: 3000
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.alertService.showAlert({
          message: err.error.message,
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileForm.patchValue({ profilePicture: input.files[0] });
    }
  }

  openChangePasswordModal(content: TemplateRef<any>) {
    this.passwordForm.reset();
    this.modalService.open(content, { centered: true });
  }

  changePassword(modalRef: any) {
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    this.passwordLoading = true;
    this.service.updatePassword({
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    }).subscribe({
      next: () => {
        this.passwordLoading = false;
        modalRef.close();
        this.alertService.showAlert({
          message: 'Password Changed',
          type: 'success',
          autoDismiss: true,
          duration: 4000
        });
      },
      error: (err) => {
        this.passwordLoading = false;
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
