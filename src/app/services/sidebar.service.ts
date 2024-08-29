import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../layout/admin/services/local-storage.service';
import { MenuItem } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private localStorageSvc = inject(LocalStorageService);

  public menu: MenuItem[] = [];

  loadMenu() {
    const menuString = this.localStorageSvc.getItem('menu');
    this.menu = menuString ? (JSON.parse(menuString) as MenuItem[]) : [];
  }
}
