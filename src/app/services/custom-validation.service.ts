import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DatabaseService } from './database.service';
import { catchError, debounceTime, map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomValidationService {

  constructor(
    private dataBaseService: DatabaseService
  ) { }

  public validation(type: 'phone' | 'password') : ValidatorFn {
    return (control: AbstractControl) : {[key: string]: any} | null => {
      if (!control.value) {
        return null;
      }
      const regexExpression = type === 'phone' ? "^[0-9]{10}$" : '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'
      const regex = new RegExp(regexExpression);
      const isValid = regex.test(control.value);
      return isValid ? null : type === 'phone' ? {invalidPhone: true} : {invalidPassword: true}
    }
  }

  checkPassword(password: string, confirmPass: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPass];

      if (!passwordControl || !confirmPassControl) {
        return null;
      }

      if (confirmPassControl.errors && !confirmPassControl.errors.passwordNotEqual) {
        return null;
      }

      if (passwordControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ passwordNotEqual: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    }
  }

  public emailAvailability(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> =>  {
      if (!control.value) {
        return of(null);
      }
      return control.valueChanges.pipe(
        debounceTime(500),
        take(1),
        switchMap( val => {
          return this.dataBaseService.getUser(control.value).pipe(
            map (res => {
              return res ? {emailExists: true} : null
            }),
            catchError( error => of(null))
          )
        })
      )

    }
  }

}
