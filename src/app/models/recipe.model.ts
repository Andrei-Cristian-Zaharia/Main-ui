import {PersonModel} from "./person.model";
import {IngredientModel} from "./ingredient.model";

export class RecipeModel {
    name: string;
    description: string;
    howToPrepare: string;
    time: number;
    difficulty: number;
    imageAddress: string;
    missingIngredients: number;
    person: PersonModel;
    ingredientList: IngredientModel[];
}
