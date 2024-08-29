import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AdminTypes } from '../../../enums/admin';
import { LocalStorageService } from './local-storage.service';

const base_url = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private localStorageSvc = inject(LocalStorageService);

  constructor() {}

  async uploadFile(file: File, type: AdminTypes, id: string) {
    try {
      const url = `${base_url}/upload/${type}/${id}`;

      const formData = new FormData();
      formData.append('image', file);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': this.localStorageSvc.getItem('token') || '',
        },
        body: formData,
      });
      const data = await resp.json();

      if (data.ok) {
        return data.fileName;
      } else {
        console.log('Upload failed');
        throw new Error(data.msg);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
