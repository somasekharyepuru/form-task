import { formatDate } from '@angular/common';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user.model';
import { CustomValidationService } from 'src/app/services/custom-validation.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'ms-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  @Input() formData: User;
  userRegistrationForm: FormGroup = new FormGroup({});
  countries: string[] = ['India', 'Sri Lanka'];
  states: string[] = ['Andhra Pradesh', 'Gujarath'];
  cities: string[] = ['Hyderabad', 'Ahmedabad'];
  fromUpdate = false;
  constructor(
    private fb: FormBuilder,
    private customValidation: CustomValidationService,
    private dataBaseService: DatabaseService,
    @Optional() private activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buildUserRegistrationForm();
    if (this.formData) {
      this.userRegistrationForm.setValue(this.formData);
      this.fromUpdate = true;
      this.userRegistrationForm.get('email').disable();
    }
  }
  // methods
  /**
   * build login form
   * submit form
   * reset
   */

  private buildUserRegistrationForm(): void {
    this.userRegistrationForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email], [this.customValidation.emailAvailability()]],
      phone: ['', [Validators.required, this.customValidation.validation('phone')]],
      dateOfBirth: ['', [Validators.required]],
      password: ['', [Validators.required, this.customValidation.validation('password')]],
      confirmPass: ['', [Validators.required]],
      address: this.fb.group({
        city: ['', [Validators.required]],
        country: ['', [Validators.required]],
        state: ['', [Validators.required]],
      })
    }, {
      validator: this.customValidation.checkPassword('password', 'confirmPass'),
    })
  }

  public get addressForm() {
    return this.userRegistrationForm.get('address') as FormGroup;
  }

  public submit(): void {
    if (this.userRegistrationForm.invalid) {
      return;
    }
    if (this.fromUpdate) {
      this.dataBaseService.updateUser(this.userRegistrationForm.getRawValue()).subscribe( data => {
        this.reset();
        if (this.activeModal) {
          this.activeModal.close();
        }
        console.log('updated successfully')
      }, error => {
        console.log('Failed to updated')
      })
    } else {
      this.dataBaseService.addUser(this.userRegistrationForm.getRawValue()).subscribe( data => {
        this.reset();
        this.toastr.success('Added Successfully');
        console.log('added successfully')
      }, error => {
        console.log('Failed to add')
      })
    }

  }

  public reset(): void {
    this.userRegistrationForm.reset();
    this.addressForm.patchValue({
      country: '',
      state: '',
      city: ''
    })
  }

}
