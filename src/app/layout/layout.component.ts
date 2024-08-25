import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { NgFor, SlicePipe } from '@angular/common';
import { SidebarService } from '../services/sidebar.service';
import { User } from '../models/user.model';
import { ImageModalComponent } from './shared/image-modal/image-modal.component';
import { UserService } from './admin/services/user.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgFor,
    SlicePipe,
    ImageModalComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  private userSvc = inject(UserService);
  private sidebarSvc = inject(SidebarService);

  menuItems: any[];
  public user: User | undefined;

  constructor() {
    this.menuItems = this.sidebarSvc.menu;
    this.user = this.userSvc.user;
  }

  logout() {
    this.userSvc.logout();
  }
}
