interface _Category {
  id: string;
  name: string;
  image: string;
  creationAt: Date;
  updatedAt: Date;
}

export class Category {
  constructor(
    public id: string,
    public name: string,
    public image: string,
    public creationAt: Date,
    public updatedAt: Date
  ) {}
}
