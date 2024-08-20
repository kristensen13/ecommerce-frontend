// interface _User {
//   id: string;
//   email: string;
//   password: string;
//   name: string;
//   role: string;
//   avatar: string;
//   creationAt: Date;
//   updatedAt: Date;
// }

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
}
