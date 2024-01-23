import {CategoryRepoInterface} from "./CategoryRepoInterface";
import {Category} from "./Category";
import * as fs from "fs";
import path from "node:path";

export class CategoryRepoMock implements CategoryRepoInterface {
  private categories: Array<Category> = [];

  constructor() {
    const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, './category_mock.json'), 'utf-8'));

    for (const i of data) {
      const cat = new Category();
      cat.id = i.id;
      cat.name = i.name;
      this.categories.push(cat);
    }
  }

  public getCategories(): Array<Category> {
    return this.categories;
  }
}