import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../../models/product.model';
import { Category } from '../../../../models/category.model';
import { User } from '../../../../models/user.model';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private productSvc = inject(ProductService);
  private categorySvc = inject(CategoryService);
  private userSvc = inject(UserService);

  isSidePanelVisible: boolean = false;

  // productObj: Product = {
  //   id: '',
  //   title: '',
  //   price: 0,
  //   description: '',
  //   images: [],
  //   creationAt: new Date(),
  //   updatedAt: new Date(),
  //   category: {
  //     id: 0,
  //     name: '',
  //     image: '',
  //     creationAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  // };

  productObj: any = {
    title: '',
    price: 0,
    description: '',
    categoryId: 0,
    images: [''],
  };

  categoryObj: Category = {
    id: '',
    name: '',
    image: '',
    creationAt: new Date(),
    updatedAt: new Date(),
  };

  userObj: User = {
    email: '',
    password: '',
    name: '',
    role: '',
    img: '',
    google: false,
    uid: '',
    imageUrl: '',
  };

  categoryList: Category[] = [];
  productList: Product[] = [];
  userList: User[] = [];

  ngOnInit(): void {
    this.getAllCategories();
    this.getAllProducts();
    this.getAllUsers();
  }

  getAllCategories() {
    this.categorySvc.getCategories().subscribe({
      next: (res: any) => {
        this.categoryList = res;
        // console.log(this.categoryList, 'Categories fetched successfully');
      },
      error: (err) => {
        console.log(err, 'Error while fetching categories');
      },
    });
  }

  getAllProducts() {
    this.productSvc.getProducts().subscribe({
      next: (res: any) => {
        this.productList = res;
        // console.log(this.productList, 'Products fetched successfully');
      },
      error: (err) => {
        console.log(err, 'Error while fetching products');
      },
    });
  }

  getAllUsers() {
    this.userSvc.getUsers().subscribe({
      next: (res: any) => {
        this.userList = res;
        // console.log(this.userList, 'Users fetched successfully');
      },
      error: (err) => {
        console.log(err, 'Error while fetching users');
      },
    });
  }

  onSave() {
    this.productSvc.createProduct(this.productObj).subscribe({
      next: (res: any) => {
        console.log(res, 'Product created successfully');
        this.getAllProducts();
      },
      error: (err) => {
        console.log(err, 'Error while creating product');
      },
    });
  }

  openSidePanel() {
    this.isSidePanelVisible = true;
  }

  closeSidePanel() {
    this.isSidePanelVisible = false;
  }
}
