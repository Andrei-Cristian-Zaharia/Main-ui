import {PersonModel} from "./person.model";
import {IngredientModel} from "./ingredient.model";
import {BaseEntityModel} from "./baseEntity.model";

export class BasicRecipeModel extends  BaseEntityModel {
    name: string;
    description: string;
    howToPrepare: string;
    time: number;
    difficulty: number;
    spiciness: number;
    rating: number;
    vegan: boolean;
    imageAddress: string;
    person: PersonModel;
    status: string;
    publicRecipe: boolean;

    constructor(category: string) {
        super("RECIPE", false);
    }
}

export class RecipeModel extends BasicRecipeModel {

    ingredientList: IngredientModel[] = new Array<IngredientModel>();

    constructor() {
        super("RECIPE");
    }
}
