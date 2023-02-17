import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RecipeModel} from "../models/recipe.model";
import {AuthService} from "./auth.service";
import {ApiConfig} from "../configs/api-config.service";
import {ReviewModel} from "../models/review.model";

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    constructor(
        @Inject(ApiConfig) private apiConfig: ApiConfig,
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getReviewsForRecipe(id: number) {

        let body = {
            "category": "RECIPE",
            "id": id
        }

        return this.http.post<ReviewModel[]>(this.apiConfig.REVIEW_API + "/all/entity", body, this.getOptions());
    }

    checkReviewFromUserOnRecipe(email: string, recipeId: number) {
        return this.http.get<boolean>(this.apiConfig.REVIEW_API + "/check/recipe/existence?email=" + email + "&recipeId=" + recipeId);
    }

    createNewReview(review) {
        return this.http.post(this.apiConfig.REVIEW_API + "/create", review, this.getOptionsAuth());
    }

    getOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
    }

    getOptionsAuth() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: this.authService.getToken()
            })
        };
    }
}
