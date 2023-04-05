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

    getRecipesFilteredByIngredients(body) {
        return this.http.post<RecipeModel[]>(this.apiConfig.RECIPE_API + "/all/filtered", body);
    }

    getRecipeByName(recipeName: string) {
        return this.http.get<RecipeModel>(this.apiConfig.RECIPE_API + "/findByName?name=" + recipeName);
    }

    getRecipesForUser(name: string) {
        return this.http.get<RecipeModel[]>(this.apiConfig.RECIPE_API + "/all/owner/username?name=" + name);
    }

    createNewRecipe(recipe) {
        return this.http.post(this.apiConfig.RECIPE_API, recipe, this.getOptions());
    }

    addFavorite(recipeId: number, userId: number) {
        let body = {
            "recipeId": recipeId,
            "userId": userId
        }
        return this.http.post<String>(this.apiConfig.RECIPE_API + "/addFavorite", body, this.getOptions());
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
