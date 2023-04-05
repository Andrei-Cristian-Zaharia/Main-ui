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

    getReviewsForEntity(id: number, category: string) {

        let body = {
            "category": category,
            "id": id
        }

        return this.http.post<ReviewModel[]>(this.apiConfig.REVIEW_API + "/all/entity", body, this.getOptions());
    }

    checkReviewFromUserOnEntity(email: string, entityId: number, category: string) {
        return this.http.get<boolean>(this.apiConfig.REVIEW_API +
            "/check/entity/existence?email=" + email +
            "&entityId=" + entityId + "" +
            "&category=" + category
        );
    }

    getReviewsForUser(email: string) {
        return this.http.get<ReviewModel[]>(this.apiConfig.REVIEW_API + "/all/user?email=" + email);
    }

    editReview(review) {
        return this.http.post(this.apiConfig.REVIEW_API + "/edit", review, this.getOptionsAuth());
    }

    createNewReview(review) {
        return this.http.post(this.apiConfig.REVIEW_API + "/create", review, this.getOptionsAuth());
    }

    deleteReview(id: number) {
        return this.http.delete(this.apiConfig.REVIEW_API + "/delete?id=" + id, this.getOptionsAuth());
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
