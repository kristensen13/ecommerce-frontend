import { Pipe, PipeTransform } from '@angular/core';
import { AdminTypes } from '../enums/admin';
import { environment } from '../../environments/environment';

const base_url = environment.BASE_URL;

@Pipe({
  name: 'image',
  standalone: true,
})
export class ImagePipe implements PipeTransform {
  transform(img: string, type: AdminTypes): string {
    if (!img) {
      return `${base_url}/upload/stores/no-image`;
    } else if (img && img.includes('https')) {
      return img;
    } else if (img) {
      return `${base_url}/upload/${type}/${img}`;
    } else {
      return `${base_url}/upload/stores/no-image`;
    }
  }
}
