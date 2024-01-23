import {Product} from "./Product";

export interface ProductRepoInterface {
  getProductsByCategoryId(categoryId: number): Array<Product>;
}