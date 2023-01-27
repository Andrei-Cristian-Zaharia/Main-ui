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

    createNewReview(review) {
        return this.http.post(this.apiConfig.REVIEW_API, review, this.getOptionsAuth());
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
