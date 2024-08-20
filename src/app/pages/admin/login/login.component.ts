import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../../services/user/user.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements AfterViewInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private userSvc = inject(UserService);

  @ViewChild('googleBtn')
  googleBtn!: ElementRef;

  public formSubmited = false;

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id:
        '418389368242-hg8uf01tgp8uh9g37bgnkog44634mni9.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });
    google.accounts.id.renderButton(
      // document.getElementById('buttonDiv'),
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large' } // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    if (response.credential) {
      console.log('ID Token: ' + response.credential);
      this.userSvc.loginGoogle(response.credential).subscribe({
        next: (resp) => {
          // console.log('Login', resp);
          this.router.navigateByUrl('/products');
        },
        error: (err) => {
          // console.log('Error', err);
          Swal.fire('Error', err.error.msg, 'error');
        },
        complete: () => {
          console.log('Request completed');
        },
      });
    } else {
      console.log('Error: ' + response.error);
    }
  }

  public loginForm: any = this.fb.group({
    email: ['liam@gmail.com', [Validators.required, Validators.email]],
    password: ['123456', Validators.required],
  });

  onLogin() {
    this.userSvc.login(this.loginForm.value).subscribe({
      next: (resp) => {
        // console.log('Login', resp);
        this.router.navigateByUrl('/products');
      },
      error: (err) => {
        // console.log('Error', err);
        Swal.fire('Error', err.error.msg, 'error');
      },
      complete: () => {
        console.log('Request completed');
      },
    });
  }
}
