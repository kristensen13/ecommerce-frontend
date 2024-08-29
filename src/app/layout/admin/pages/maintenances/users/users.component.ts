import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../../../models/user.model';
import { AdminTypes } from '../../../../../enums/admin';
import Swal from 'sweetalert2';
import { FormsModule, NgModel } from '@angular/forms';
import { SearchesService } from '../../../services/searches.service';
import { UserService } from '../../../services/user.service';
import { ImageModalService } from '../../../../../services/image-modal.service';
import { Subscription, delay } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, OnDestroy {
  private userSvc = inject(UserService);
  private searchesSvc = inject(SearchesService);
  private imageModalSvc = inject(ImageModalService);
  public loading: boolean = true;
  public users: User[] = [];
  public tempUsers: User[] = [];
  public imgSubs!: Subscription;
  public totalUsers: number = 0;
  public from: number = 0;

  ngOnInit(): void {
    this.getUsers();
    this.imgSubs = this.imageModalSvc.newImage
      .pipe(delay(100))
      .subscribe((img) => {
        this.getUsers();
      });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  getUsers() {
    this.loading = true;
    this.userSvc.loadUsers(this.from).subscribe(({ total, users }) => {
      this.totalUsers = total;
      this.users = users;
      this.tempUsers = users;
      this.loading = false;
    });
  }

  changeFrom(value: number) {
    this.from += value;

    if (this.from < 0) {
      this.from = 0;
    } else if (this.from > this.totalUsers) {
      this.from -= value;
    }
    this.getUsers();
  }

  search(term: string) {
    if (term.length === 0) {
      this.users = this.tempUsers;
      return;
    }

    this.searchesSvc.search(AdminTypes.users, term).subscribe({
      next: (results) => {
        this.users = results as User[];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteUser(user: User) {
    if (user.uid === this.userSvc.uid) {
      return Swal.fire('Error', 'You can not delete yourself', 'error');
    }

    Swal.fire({
      title: 'Delete user?',
      text: `Is about to erase ${user.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userSvc.deleteUser(user).subscribe({
          next: () => {
            Swal.fire(
              'Deleted',
              `User ${user.name} deleted successfully`,
              'success'
            );
            this.getUsers();
          },
          error: (err) => {
            Swal.fire('Error', err.error.msg, 'error');
          },
        });
      }
    });
    return;
  }

  changeRole(user: User) {
    this.userSvc.saveUser(user).subscribe({
      next: () => {
        Swal.fire('Updated', 'Role updated successfully', 'success');
      },
      error: (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      },
    });
  }

  //TODO: Implement the editUser method

  openModal(user: User) {
    this.imageModalSvc.openModal(AdminTypes.users, user.uid, user.img);
  }
}
