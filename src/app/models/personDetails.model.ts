import {RestaurantModel} from "./restaurant.model";
import {RecipeModel} from "./recipe.model";

export class PersonDetailsModel {

    username: string;
    emailAddress: string;
    hasRestaurant: boolean;
    accountType: string;
    ownedRestaurant: RestaurantModel;
    ownedRecipes: RecipeModel[] = new Array<RecipeModel>;
}
