import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Offcanvas } from 'bootstrap';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';

import { NgFor, SlicePipe } from '@angular/common';
import { SidebarService } from '../services/sidebar.service';
import { User } from '../models/user.model';
import { ImageModalComponent } from './shared/image-modal/image-modal.component';
import { UserService } from './admin/services/user.service';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements AfterViewInit, OnInit {
  private userSvc = inject(UserService);
  public sidebarSvc = inject(SidebarService);
  private offcanvasElement: Offcanvas | null = null;
  private router = inject(Router);

  // menuItems: any[];
  public user: User;

  constructor() {
    // this.menuItems = this.sidebarSvc.menu;
    this.user = this.userSvc.user;
  }
  ngOnInit(): void {
    this.sidebarSvc.loadMenu();
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

  search(term: string) {
    if (term.length === 0) {
      return;
    }
    this.router.navigateByUrl(`/dashboard/search/${term}`);
  }
}
