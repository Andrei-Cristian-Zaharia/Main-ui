import {PersonModel} from "./person.model";
import {IngredientModel} from "./ingredient.model";

export class RecipeModel {
    id: number;
    name: string;
    description: string;
    howToPrepare: string;
    time: number;
    difficulty: number;
    spiciness: number;
    rating: number;
    isVegan: boolean;
    imageAddress: string;
    missingIngredients: number;
    person: PersonModel;
    ingredientList: IngredientModel[];
}
