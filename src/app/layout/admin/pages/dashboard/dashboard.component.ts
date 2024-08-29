import { Component, inject, OnInit } from '@angular/core';
import { LayoutComponent } from '../../../layout.component';
import { SidebarService } from '../../../../services/sidebar.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LayoutComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  public sidebarSvc = inject(SidebarService);
  ngOnInit(): void {
    this.sidebarSvc.loadMenu();
  }
}
