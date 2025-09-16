import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProfileService } from './service/profile.service';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
  changePasswordMode = false;

  constructor(
    private service: ProfileService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadProfile()

    this.profileFormInit()
    this.passwordFormInit()
  }

  loadProfile() {
    this.service.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res.data;
        if (this.profile.CustomerProfile) {
          this.profileForm.patchValue(this.profile.CustomerProfile);
        }
      },
      error: (err) => {
        console.error(err);
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

    const payload = this.profileForm.value;

    const request$ = this.service.updateProfile(payload)

    request$.subscribe({
      next: (res: any) => {
        this.profile = res.data;
        this.editMode = false;
        this.profileForm.patchValue(this.profile.CustomerProfile);
      },
      error: (err) => console.error(err)
    });
  }

  toggleChangePassword() {
    this.changePasswordMode = !this.changePasswordMode;
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    this.service.updatePassword({
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    }).subscribe({
      next: () => {
        alert("Password updated successfully!");
        this.changePasswordMode = false;
        this.passwordForm.reset();
      },
      error: (err) => console.error(err)
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileForm.patchValue({ profilePicture: input.files[0] });
    }
  }

}
