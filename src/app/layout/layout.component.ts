import { AfterViewInit, Component, inject } from '@angular/core';
import { Offcanvas } from 'bootstrap';
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
export class LayoutComponent implements AfterViewInit {
  private userSvc = inject(UserService);
  private sidebarSvc = inject(SidebarService);
  private offcanvasElement: Offcanvas | null = null;

  menuItems: any[];
  public user: User | undefined;

  constructor() {
    this.menuItems = this.sidebarSvc.menu;
    this.user = this.userSvc.user;
  }
  ngAfterViewInit(): void {
    const offcanvasElement = document.getElementById('mynavbar');
    if (offcanvasElement) {
      this.offcanvasElement = new Offcanvas(offcanvasElement);
    }
  }

  closeSidebar() {
    if (this.offcanvasElement) {
      this.offcanvasElement.hide();
    }
    this.removeAllBackdrops(); // Eliminar todos los backdrops
  }

  private removeAllBackdrops() {
    document.querySelectorAll('.offcanvas-backdrop').forEach((backdrop) => {
      backdrop.remove();
    });
  }

  logout() {
    this.userSvc.logout();
    this.closeSidebar();
  }
}
