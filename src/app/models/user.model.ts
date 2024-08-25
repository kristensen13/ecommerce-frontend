import { environment } from './../../environments/environment';

const base_url = environment.BASE_URL;
export class User {
  constructor(
    public name: string,
    public email: string,
    public password?: string,
    public img?: string,
    public google?: boolean,
    public role?: string,
    public uid?: string
  ) {}

  get imageUrl() {
    if (!this.img) {
      return `${base_url}/upload/users/no-image`;
    } else if (this.img && this.img.includes('https')) {
      return this.img;
    } else if (this.img) {
      return `${base_url}/upload/users/${this.img}`;
    } else {
      return `${base_url}/upload/users/no-image`;
    }
  }
}
