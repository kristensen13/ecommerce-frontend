import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AdminTypes } from '../../../../../enums/admin';
import { SearchesService } from '../../../services/searches.service';
import { NgFor } from '@angular/common';
import { Store } from '../../../../../models/store.model';
import { StoreService } from '../../../services/store.service';
import { FormsModule } from '@angular/forms';
import { ImagePipe } from '../../../../../pipes/image.pipe';
import { PipesModule } from '../../../../../pipes/pipes.module';
import Swal from 'sweetalert2';
import { ImageModalService } from '../../../../../services/image-modal.service';
import { Subscription, delay } from 'rxjs';

@Component({
  selector: 'app-stores',
  standalone: true,
  imports: [NgFor, FormsModule, PipesModule, ImagePipe],
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.css',
})
export class StoresComponent implements OnInit, OnDestroy {
  private searchesSvc = inject(SearchesService);
  private storeSvc = inject(StoreService);
  private imageModalSvc = inject(ImageModalService);
  public imgSubs!: Subscription;
  public loading: boolean = true;
  public stores: Store[] = [];
  public tempStores: Store[] = [];
  public totalStores: number = 0;
  public imagePipeType: AdminTypes = AdminTypes.stores;

  ngOnInit(): void {
    this.loadStores();
    this.imgSubs = this.imageModalSvc.newImage
      .pipe(delay(100))
      .subscribe((img) => {
        this.loadStores();
      });
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  search(term: string) {
    if (term.length === 0) {
      this.stores = this.tempStores;
      return;
    }

    this.searchesSvc.search(AdminTypes.stores, term).subscribe({
      next: (results) => {
        this.stores = results as Store[];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadStores() {
    this.loading = true;
    this.storeSvc.loadStores().subscribe({
      next: (stores: Store[]) => {
        this.stores = stores;
        this.tempStores = stores;
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  saveChanges(store: Store) {
    if (store._id && store.name) {
      this.storeSvc.updateStore(store._id!, store.name).subscribe({
        next: (resp) => {
          Swal.fire('Updated', store.name, 'success');
        },
        error: (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        },
      });
    } else {
      Swal.fire('Error', 'Store name is required', 'error');
    }
  }

  deleteStore(store: Store) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are going to delete ${store.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(
      (result) => {
        if (result.isConfirmed) {
          this.storeSvc.deleteStore(store._id!).subscribe({
            next: (resp) => {
              // Swal.fire('Deleted', store.name, 'success');
              this.loadStores();
            },
            error: (err) => {
              Swal.fire('Error', err.error.msg, 'error');
            },
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  async createStore() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Create a new store',
      input: 'text',
      inputLabel: 'Enter store name',
      inputPlaceholder: 'Name of the store',
      showCancelButton: true,
      confirmButtonText: 'Create',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: (name) => {
        return this.storeSvc.createStore(name).subscribe({
          next: (resp) => {
            // Swal.fire(
            //   'Created',
            //   `${name} store created successfully`,
            //   'success'
            // );
            this.loadStores();
          },
          error: (err) => {
            Swal.showValidationMessage(`Request failed: ${err.error.msg}`);
          },
        });
      },
    });
  }

  openModal(store: Store) {
    console.log(store);

    this.imageModalSvc.openModal(AdminTypes.stores, store._id, store.img);
  }
}
