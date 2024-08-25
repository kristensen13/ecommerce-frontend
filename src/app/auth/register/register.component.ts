import { Component, inject } from '@angular/core';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../layout/admin/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private userSvc = inject(UserService);
  private router = inject(Router);

  public formSubmited = false;
  public registerForm: any = this.fb.group(
    {
      name: ['Wilson', [Validators.required, Validators.minLength(3)]],
      email: ['wilson@gmail.com', [Validators.required, Validators.email]],
      password: ['123456', Validators.required],
      confirmPassword: ['123456', Validators.required],
      terms: [true, Validators.requiredTrue],
    },
    {
      validator: this.samePasswords('password', 'confirmPassword'),
    } as AbstractControlOptions
  );

  createUser() {
    this.formSubmited = true;
    console.log(this.registerForm.value);
    // console.log(this.registerForm);

    if (this.registerForm.invalid) {
      return;
    }

    // Post request to create user

    this.userSvc.createUser(this.registerForm.value).subscribe({
      next: (resp) => {
        console.log('user created', resp);
        // Swal.fire('Success', 'User created successfully', 'success');
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }

  fieldNotValid(field: string): boolean {
    if (this.registerForm.get(field)?.invalid && this.formSubmited) {
      return true;
    } else {
      return false;
    }
  }

  passwordsNotMatch(): boolean {
    const pass = this.registerForm.get('password')?.value;
    const confirmPass = this.registerForm.get('confirmPassword')?.value;

    if (pass !== confirmPass && this.formSubmited) {
      return true;
    } else {
      return false;
    }
  }

  samePasswords(pass1Name: string, pass2Name: string) {
    return (formGroup: FormGroup) => {
      const pass1 = formGroup.get(pass1Name);
      const pass2 = formGroup.get(pass2Name);

      if (pass1?.value === pass2?.value) {
        pass2?.setErrors(null);
      } else {
        pass2?.setErrors({ notSame: true });
      }
    };
  }
}
