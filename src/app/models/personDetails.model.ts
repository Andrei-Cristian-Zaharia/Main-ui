import {RestaurantModel} from "./restaurant.model";
import {RecipeModel} from "./recipe.model";
import {PersonBasicInfoModel} from "./personBasicInfo.model";

export class PersonDetailsModel extends PersonBasicInfoModel {

    ownedRecipes: RecipeModel[] = new Array<RecipeModel>;
}
