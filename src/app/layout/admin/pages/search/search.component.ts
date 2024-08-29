import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { SearchesService } from '../../services/searches.service';
import { Product } from '../../../../models/product.model';
import { Store } from '../../../../models/store.model';
import { User } from '../../../../models/user.model';
import { NgFor } from '@angular/common';
import { AdminTypes } from '../../../../enums/admin';
import { PipesModule } from '../../../../pipes/pipes.module';
import { ImagePipe } from '../../../../pipes/image.pipe';
import { Employee } from '../../../../models/employee.model';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [NgFor, PipesModule, ImagePipe, RouterLink, RouterLinkActive],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private searchesService = inject(SearchesService);

  public users: User[] = [];
  public employees: Employee[] = [];
  public stores: Store[] = [];
  public products: Product[] = [];
  public imagePipeTypeUser: AdminTypes = AdminTypes.users;
  public imagePipeTypeStore: AdminTypes = AdminTypes.stores;
  public imagePipeTypeProduct: AdminTypes = AdminTypes.products;
  public imagePipeTypeEmployee: AdminTypes = AdminTypes.employees;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ term }) => this.globalSearch(term));
  }

  globalSearch(term: string) {
    this.searchesService.globalSearch(term).subscribe({
      next: (results: any) => {
        this.users = results.users;
        this.stores = results.stores;
        this.employees = results.employees;
        this.products = results.products;
      },
    });
  }
}
