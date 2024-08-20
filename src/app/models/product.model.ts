interface _Product {
  id: string;
  title: string;
  price: 2499;
  description: string;
  images: [];
  creationAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
    image: string;
    creationAt: Date;
    updatedAt: Date;
  };
}

export class Product {
  constructor(
    public id: string,
    public title: string,
    public price: number,
    public description: string,
    public images: [],
    public creationAt: Date,
    public updatedAt: Date,
    public category: {
      id: number;
      name: string;
      image: string;
      creationAt: Date;
      updatedAt: Date;
    }
  ) {}
}
