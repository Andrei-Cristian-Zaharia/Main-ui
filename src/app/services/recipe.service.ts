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

    getRecipesFilteredByIngredients(body) {
        return this.http.post<RecipeModel[]>(this.apiConfig.RECIPE_API + "/all/filtered", body);
    }

    getRecipeByName(recipeName: string) {
        return this.http.get<RecipeModel>(this.apiConfig.RECIPE_API + "/findByName?name=" + recipeName);
    }

    getRecipesForUser(name: string) {
        return this.http.get<RecipeModel[]>(this.apiConfig.RECIPE_API + "/all/owner/username?name=" + name);
    }

    countUserRecipes(email: string) {
        return this.http.get<number>(this.apiConfig.RECIPE_API + "/countUserRecipes?email=" + email);
    }

    createNewRecipe(recipe) {
        return this.http.post(this.apiConfig.RECIPE_API, recipe, this.getOptions());
    }

    addFavorite(recipeId: number, userId: number) {
        let body = {
            "recipeId": recipeId,
            "userId": userId
        }
        return this.http.post<string>(this.apiConfig.RECIPE_API + "/addFavorite", body, this.getOptions());
    }

    removeFavorite(recipeId: number, userId: number) {
        return this.http.delete(this.apiConfig.SAVED_RECIPES_API + "/delete?recipeId=" + recipeId + "&userId=" + userId,
            this.getOptions()
        );
    }

    getFavoriteListFiltered(email: string, body) {
        return this.http.post<RecipeModel[]>(this.apiConfig.RECIPE_API + "/favoriteListFiltered?email=" + email, body);
    }

    getFavoriteListNames(email: string) {
        return this.http.get<string[]>(this.apiConfig.RECIPE_API + "/favoriteNames?email=" + email);
    }

    getAllPossibleRecipes() {
        return this.http.get<RecipeModel[]>(this.apiConfig.RECIPE_API + "/all/possible", this.getOptions());
    }

    saveRecipe(body) {
        return this.http.post<RecipeModel>(this.apiConfig.RECIPE_API + "/save/status", body, this.getOptions());
    }

    deleteRecipe(id: number) {
        return this.http.delete<void>(this.apiConfig.RECIPE_API + "/delete?id=" + id, this.getOptions());
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
