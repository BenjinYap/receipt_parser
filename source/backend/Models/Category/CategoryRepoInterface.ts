import {Category} from "./Category";

export interface CategoryRepoInterface {
  getCategories(): Array<Category>;
}