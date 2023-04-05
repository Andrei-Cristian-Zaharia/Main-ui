import {PersonModel} from "./person.model";
import {IngredientModel} from "./ingredient.model";
import {BaseEntityModel} from "./baseEntity.model";

export class RecipeModel extends BaseEntityModel {
    name: string;
    description: string;
    howToPrepare: string;
    time: number;
    difficulty: number;
    spiciness: number;
    rating: number;
    isVegan: boolean;
    imageAddress: string;
    person: PersonModel;
    ingredientList: IngredientModel[];

    constructor() {
        super("RECIPE");
    }
}
