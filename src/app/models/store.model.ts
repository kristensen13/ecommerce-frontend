interface _StoreUser {
  _id: string;
  name: string;
  img: string;
}

export class Store {
  constructor(
    public name: string,
    public _id?: string,
    public img?: string,
    public user?: _StoreUser
  ) {}
}
