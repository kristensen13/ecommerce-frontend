import { Injectable } from '@angular/core';
import { environment } from './../../../../../environments/environment';

const base_url = environment.BASE_URL;

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  constructor() {}

  async uploadFile(
    file: File,
    type:
      | 'users'
      | 'stores'
      | 'employees'
      | 'products'
      | 'categories'
      | 'orders'
      | 'customers',
    id: string
  ) {
    try {
      const url = `${base_url}/upload/${type}/${id}`;
      const formData = new FormData();
      formData.append('image', file);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || '',
        },
        body: formData,
      });
      const data = await resp.json();
      console.log(data);

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
