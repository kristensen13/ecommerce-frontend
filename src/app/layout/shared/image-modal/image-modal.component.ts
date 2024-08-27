import { Component, inject } from '@angular/core';
import { ImageModalService } from '../../../services/image-modal.service';
import { UploadFileService } from '../../admin/services/upload-file.service';
import { AdminTypes } from '../../../enums/admin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-image-modal',
  standalone: true,
  imports: [],
  templateUrl: './image-modal.component.html',
  styleUrl: './image-modal.component.css',
})
export class ImageModalComponent {
  public imageModalSvc = inject(ImageModalService);
  public uploadFileSvc = inject(UploadFileService);
  public uploadImage: File | undefined;
  public imgTemp: string = '';

  closeModal() {
    this.imgTemp = null as any as string;
    this.imageModalSvc.closeModal();
  }

  changeImage(event: any) {
    const file = event.target.files[0];
    this.uploadImage = file;
    if (!file) {
      return (this.imgTemp = '');
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.imgTemp = reader.result as string;
    };
    return null;
  }

  imageUpload() {
    const id = this.imageModalSvc.id;
    const type = this.imageModalSvc.type;

    this.uploadFileSvc
      .uploadFile(this.uploadImage!, type, id)
      .then((img) => {
        Swal.fire('Updated', 'Image updated successfully', 'success');
        this.imageModalSvc.newImage.emit(img);
        this.closeModal();
      })
      .catch((err) => {
        Swal.fire('Error', 'Error uploading image', 'error');
      });
  }
}
