import { EventEmitter, Injectable } from '@angular/core';
import { AdminTypes } from '../enums/admin';
import { environment } from '../../environments/environment';

const base_url = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class ImageModalService {
  private _hiddenModal: boolean = true;
  public type!: AdminTypes;
  public id: string = '';
  public img: string = '';

  public newImage: EventEmitter<string> = new EventEmitter<string>();

  get hiddenModal(): boolean {
    return this._hiddenModal;
  }

  openModal(type: AdminTypes, id: string = '', img: string = 'no-img') {
    this._hiddenModal = false;
    this.type = type;
    this.id = id;

    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${type}/${img}`;
    }
  }

  closeModal() {
    this._hiddenModal = true;
  }
}
