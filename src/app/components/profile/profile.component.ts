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
  bankForm!: FormGroup;
  bankLoading = false;
  bankDetails: any[] = [];
  editingBankId: string | null = null;

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
    this.bankFormInit();
    this.loadBankDetails();
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

  loadBankDetails() {
    this.service.getBankDetails().subscribe({
      next: (res: any) => {
        this.bankDetails = res.data;
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

  bankFormInit() {
    this.bankForm = this.fb.group({
      accountNumber: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      ifscCode: ['', Validators.required]
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
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    this.passwordForm.reset();
    this.modalService.open(content, { centered: true });
  }

  openBankDetailsModal(content: TemplateRef<any>, bank?: any) {
    if (bank) {
      this.editingBankId = bank.id;
      this.bankForm.patchValue(bank);
    } else {
      this.editingBankId = null;
      this.bankForm.reset();
    }
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

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

  saveBankDetails(modalRef: any) {
    if (this.bankForm.invalid) return;

    this.bankLoading = true;

    const action$ = this.editingBankId
      ? this.service.updateBankDetails({ ...this.bankForm.value, id: this.editingBankId })
      : this.service.addBankDetails(this.bankForm.value);

    action$.subscribe({
      next: () => {
        this.bankLoading = false;
        modalRef.close();
        this.loadBankDetails();
        this.alertService.showAlert({
          message: this.editingBankId ? 'Bank details updated' : 'Bank details added',
          type: 'success',
          autoDismiss: true,
          duration: 3000
        });
      },
      error: (err) => {
        this.bankLoading = false;
        this.alertService.showAlert({
          message: err.error?.message || 'Failed to save bank details',
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

  deleteBankDetail(id: string) {
    if (!confirm("Are you sure you want to delete this bank detail?")) return;

    this.service.deleteBankDetails(id).subscribe({
      next: () => {
        this.loadBankDetails();
        this.alertService.showAlert({
          message: 'Bank detail deleted',
          type: 'success',
          autoDismiss: true,
          duration: 3000
        });
      },
      error: (err) => {
        this.alertService.showAlert({
          message: err.error?.message || 'Failed to delete bank detail',
          type: 'error',
          autoDismiss: true,
          duration: 4000
        });
      }
    });
  }

}
