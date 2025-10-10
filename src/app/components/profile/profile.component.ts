import { CommonModule } from '@angular/common';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from "../../shared/header/header.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { ProfileService } from './service/profile.service';
import { AlertService } from '../../shared/alert/service/alert.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, HeaderComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = null;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;
  bankForm!: FormGroup;
  addressForm!: FormGroup;
  addresses: any[] = []
  customerProfileId!: any;
  editingAddressId: string | null = null;

  loading = false;
  passwordLoading = false;
  bankLoading = false;
  addressLoading = false;

  editMode = false;
  bankDetails: any[] = [];
  editingBankId: string | null = null;

  constructor(
    private service: ProfileService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.loadProfile();
    this.loadBankDetails();
    this.loadAddresses()
  }

  private initForms() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      profilePicture: ['']
    });

    this.bankForm = this.fb.group({
      accountNumber: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      ifscCode: ['', Validators.required]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.addressForm = this.fb.group({
      customerProfileId: [''],
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['', Validators.required],
      landmark: [''],
      phone: ['', Validators.required],
      isDefault: [false]
    });
  }

  loadProfile() {
    this.loading = true;
    this.service.getProfile().subscribe({
      next: (res: any) => {
        this.profile = res.data;
        this.customerProfileId = res.data.id;
        this.profileForm.patchValue(this.profile);
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  enableEdit() {
    this.editMode = true;
  }

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.loading = true;
    this.service.updateProfile(this.profileForm.value).subscribe({
      next: (res: any) => {
        this.profile = res.data;
        this.editMode = false;
        this.loading = false;
        this.showAlert('Profile updated successfully', 'success');
      },
      error: (err) => {
        this.loading = false;
        this.showAlert(err.error?.message || 'Profile update failed', 'error');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.profileForm.patchValue({ profilePicture: input.files[0] });
    }
  }

  loadBankDetails() {
    this.service.getBankDetails().subscribe({
      next: (res: any) => (this.bankDetails = res.data),
      error: (err) => console.error(err)
    });
  }

  openBankDetailsModal(content: TemplateRef<any>, bank?: any) {
    this.editingBankId = bank ? bank.id : null;
    this.bankForm.reset(bank || {});
    this.modalService.open(content, { centered: true });
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
        this.showAlert(this.editingBankId ? 'Bank details updated' : 'Bank details added', 'success');
      },
      error: (err) => {
        this.bankLoading = false;
        this.showAlert(err.error?.message || 'Failed to save bank details', 'error');
      }
    });
  }

  deleteBankDetail(id: string) {
    if (!confirm('Are you sure you want to delete this bank detail?')) return;
    this.service.deleteBankDetails(id).subscribe({
      next: () => {
        this.loadBankDetails();
        this.showAlert('Bank detail deleted', 'success');
      },
      error: (err) => {
        this.showAlert(err.error?.message || 'Failed to delete bank detail', 'error');
      }
    });
  }

  openChangePasswordModal(content: TemplateRef<any>) {
    this.passwordForm.reset();
    this.modalService.open(content, { centered: true });
  }

  changePassword(modalRef: any) {
    if (this.passwordForm.invalid) return;
    if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword)
      return this.showAlert('New passwords do not match!', 'error');

    this.passwordLoading = true;
    this.service.updatePassword({
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    }).subscribe({
      next: () => {
        this.passwordLoading = false;
        modalRef.close();
        this.showAlert('Password changed successfully', 'success');
      },
      error: (err) => {
        this.passwordLoading = false;
        this.showAlert(err.error?.message || 'Failed to change password', 'error');
      }
    });
  }

  loadAddresses() {
    this.service.getAddresses().subscribe({
      next: (res: any) => (this.addresses = res.data),
      error: (err) => console.error(err)
    });
  }

  openAddressModal(content: TemplateRef<any>, address?: any) {
    this.addressForm.reset({
      isDefault: false
    });
    this.editingAddressId = address ? address.id : null;

    if (address) {
      this.addressForm.patchValue(address);
    }

    this.modalService.open(content, { size: 'lg', centered: true });
  }

  saveAddress(modalRef: any) {
    if (this.addressForm.invalid) return;
    this.addressLoading = true;

    const payload = {
      ...this.addressForm.value,
      customerProfileId: String(this.customerProfileId),
      isDefault: this.addressForm.value.isDefault ?? false
    };

    const request$ = this.editingAddressId
      ? this.service.updateAddress(payload, this.editingAddressId)
      : this.service.addAddress(payload);

    request$.subscribe({
      next: () => {
        this.addressLoading = false;
        modalRef.close();
        this.loadAddresses();
        this.showAlert(
          this.editingAddressId ? 'Address updated successfully' : 'Address added successfully',
          'success'
        );
      },
      error: (err) => {
        this.addressLoading = false;
        this.showAlert(err.error?.message || 'Failed to save address', 'error');
      }
    });
  }

  deleteAddress(id: string) {
    if (!confirm('Are you sure you want to delete this address?')) return;
    this.service.deleteAddress(id).subscribe({
      next: () => {
        this.loadAddresses();
        this.showAlert('Address deleted successfully', 'success');
      },
      error: (err) => {
        this.showAlert(err.error?.message || 'Failed to delete address', 'error');
      }
    });
  }

  setAsDefault(id: string) {
    const targetAddress = this.addresses.find(a => a.id === id);
    if (!targetAddress) return;

    const updatedData = { ...targetAddress, isDefault: true };

    this.service.updateAddress(updatedData, id).subscribe({
      next: () => {
        this.loadAddresses();
        this.showAlert('Address set as default', 'success');
      },
      error: (err) => {
        this.showAlert(err.error?.message || 'Failed to set default address', 'error');
      }
    });
  }

  private showAlert(message: string, type: 'success' | 'error') {
    this.alertService.showAlert({ message, type, autoDismiss: true, duration: 3000 });
  }
}
