import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BasicIngredientModel} from "../models/basicIngredient.model";
import {IngredientsByCategoryModel} from "../models/ingredientsByCategory.model";
import {ApiConfig} from "../configs/api-config.service";

@Injectable({
    providedIn: 'root'
})
export class IngredientService {

    constructor(
        @Inject(ApiConfig) private apiConfig: ApiConfig,
        private http: HttpClient
    ) { }

    getIngredients() {
        return this.http.get<BasicIngredientModel[]>(this.apiConfig.INGREDIENT_API + "all");
    }

    getIngredientsNames() {
        return this.http.get<string[]>(this.apiConfig.INGREDIENT_API  + "all/name");
    }

    getAllIngredientsByCategory() {
        return this.http.get<IngredientsByCategoryModel>(this.apiConfig.INGREDIENT_API + "all/byCategory");
    }

    getAllIngredientsByCategoryWithFilter(nameFilter) {
        return this.http.get<IngredientsByCategoryModel>(this.apiConfig.INGREDIENT_API + "all/byCategory/filter?nameFilter=" + nameFilter);
    }
}
