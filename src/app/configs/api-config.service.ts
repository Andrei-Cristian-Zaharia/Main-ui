import {InjectionToken} from "@angular/core";

export const API_CONFIG = new InjectionToken<ApiConfig>('api-config');

export class ApiConfig {

    private _AUTH_API: string = 'http://localhost:3005/v1/core-api/auth';
    private _RECIPE_API: string = 'http://localhost:3005/v1/food-api/recipe';
    private _INGREDIENT_API: string = 'http://localhost:3005/v1/food-api/ingredient/';
    private _UTILS_API: string = 'http://localhost:3005/v1/food-api/utils/';
    private _PERSON_API: string = 'http://localhost:3005/v1/core-api/person';
    private _REVIEW_API: string = 'http://localhost:3005/v1/core-api/review';


    get PERSON_API(): string {
        return this._PERSON_API;
    }

    public get AUTH_API(): string {
        return this._AUTH_API;
    }

    public get RECIPE_API(): string {
        return this._RECIPE_API;
    }

    public get INGREDIENT_API(): string {
        return this._INGREDIENT_API;
    }

    public get UTILS_API(): string {
        return this._UTILS_API;
    }

    get REVIEW_API(): string {
        return this._REVIEW_API;
    }
}
