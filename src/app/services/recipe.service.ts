import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RecipeModel} from "../models/recipe.model";
import {AuthService} from "./auth.service";
import {ApiConfig} from "../configs/api-config.service";

@Injectable({
    providedIn: 'root'
})
export class RecipeService {
    constructor(
        @Inject(ApiConfig) private apiConfig: ApiConfig,
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getRecipes() {
        return this.http.get<RecipeModel[]>(this.apiConfig.RECIPE_API + "/all");
    }

    getRecipesFilteredByIngredients(ingredientsNames) {

        let names = "";

        for (let name of ingredientsNames) {
            names += name + ',';
        }
        return this.http.get<RecipeModel[]>(this.apiConfig.RECIPE_API + "/all/filterIngredients?recipeFilter=" + names);
    }

    createNewRecipe(recipe) {
        return this.http.post(this.apiConfig.RECIPE_API, recipe, this.getOptions());
    }

    getOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: this.authService.getToken()
            })
        };
    }
}
