import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { User } from '../../../models/user.model';

import Swal from 'sweetalert2';
import { AdminTypes } from '../../../enums/admin';
import { UserService } from '../../admin/services/user.service';
import { UploadFileService } from '../../admin/services/upload-file.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userSvc = inject(UserService);
  private uploadFileSvc = inject(UploadFileService);

  // public profileForm!: FormGroup;
  public user?: User;
  public uploadImage: File | undefined;
  public imgTemp: string = '';

  // Form group
  profileForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
  });
  submitted = false;

  constructor() {
    this.user = this.userSvc.user || {
      name: '',
      email: '',
      img: '',
      role: '',
      google: false,
      uid: '',
    };
  }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [this.user!.name, Validators.required],
      email: [this.user!.email, [Validators.required, Validators.email]],
    });
  }

  updateProfile() {
    this.userSvc.updateProfile(this.profileForm.value).subscribe({
      next: (resp) => {
        const { name, email } = this.profileForm.value;
        this.user!.name = name;
        this.user!.email = email;
        Swal.fire('Updated', 'Profile updated successfully', 'success');
      },
      error: (err) => {
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
      },
    });
  }

  changeImage(event: any) {
    const file = event.target.files[0];
    this.uploadImage = file;
    if (!file) {
      return (this.imgTemp = null!);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result as string;
    };
    return null;
  }

  imageUpload() {
    this.uploadFileSvc
      .uploadFile(this.uploadImage!, AdminTypes.users, this.user!.uid || '')
      .then((img) => {
        this.user!.img = img;
        Swal.fire('Updated', 'Image updated successfully', 'success');
      })
      .catch((err) => {
        Swal.fire('Error', 'Error uploading image', 'error');
      });
  }
}
