import {ProductRepoInterface} from "./ProductRepoInterface";
import {Product} from "./Product";
import * as fs from "fs";
import path from "node:path";

export class ProductRepoMock implements ProductRepoInterface {
  private products: Array<Product> = [];

  constructor() {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './product_mock.json'), 'utf-8'));

    for (const i of data) {
      const p = new Product();
      p.id = i.id;
      p.name = i.name;
      p.categoryIds = i.category_ids;
      this.products.push(p);
    }
  }

  public getProductsByCategoryId(categoryId: number): Array<Product> {
    return this.products.filter((p) => p.categoryIds?.includes(categoryId));
  }
}