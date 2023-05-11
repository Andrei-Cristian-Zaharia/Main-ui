import {BasicRecipeModel, RecipeModel} from "./recipe.model";
import {MenuService} from "../services/menu.service";

export class MenuModel {
    id: number;
    name: string;
}

export class MenuCategorisedModel {
    menuId: number;
    name: string;
    categories: MenuCategory[] = new Array<MenuCategory>();
}

export class MenuCategory {
    category: string;
    createItem: boolean = false;
    items: MenuItem[];

    constructor(categoryName: string) {
        this.category = categoryName;
        this.items = new Array<MenuItem>();
    }
}

export class MenuItem {
    id: number;
    price: number;
    name: string;
    description: string;
    new: boolean = false;
    recipe: BasicRecipeModel;

    constructor(id: number, price: number, name: string, description: string, recipe: BasicRecipeModel) {
        this.price = price;
        this.name = name;
        this.new = true;
        this.description = description;

        if (id != null) {
            this.id = id;
        } else {
            id = null;
        }

        if (recipe === null || recipe === undefined) {
            this.recipe = null;
        } else {
            this.recipe = recipe;
        }
    }
}
