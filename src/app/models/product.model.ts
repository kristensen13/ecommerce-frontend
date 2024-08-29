interface _Category {
  id: string;
  name: string;
  image: string;
  creationAt: Date;
  updatedAt: Date;
}

export class Product {
  constructor(
    public id: string,
    public title: string,
    public price: number,
    public description: string,
    public images: string[],
    public creationAt: Date,
    public updatedAt: Date,
    public category: _Category
  ) {}
}
