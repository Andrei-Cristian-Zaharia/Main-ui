import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthService} from "./auth.service";
import {ApiConfig} from "../configs/api-config.service";
import {RestaurantModel} from "../models/restaurant.model";

@Injectable({
    providedIn: 'root'
})
export class RestaurantService {
    constructor(
        @Inject(ApiConfig) private apiConfig: ApiConfig,
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getRestaurantForUser(name: string) {
        return this.http.get<RestaurantModel>(this.apiConfig.RESTAURANT_API + "/owner?name=" + name)
    }

    getRestaurantByName(name: string) {
        return this.http.get<RestaurantModel>(this.apiConfig.RESTAURANT_API + "/name?name=" + name)
    }

    getRestaurants() {
        return this.http.get<RestaurantModel[]>(this.apiConfig.RESTAURANT_API + "/all");
    }

    getRestaurantsFiltered(body) {
        return this.http.post<RestaurantModel[]>(this.apiConfig.RESTAURANT_API + "/all/filtered", body);
    }

    saveRestaurant(body) {
        return this.http.post<RestaurantModel>(this.apiConfig.RESTAURANT_API + "/save/status", body, this.getOptions());
    }

    saveRestaurantPage(body) {
        return this.http.post<RestaurantModel>(this.apiConfig.RESTAURANT_API + "/save", body, this.getOptions());
    }

    createRestaurant(body) {
        return this.http.post<RestaurantModel>(this.apiConfig.RESTAURANT_API + "/create", body, this.getOptions());
    }

    addFavorite(restaurantId: number, userId: number) {
        let body = {
            "restaurantId": restaurantId,
            "userId": userId
        }
        return this.http.post<string>(this.apiConfig.RESTAURANT_API + "/addFavorite", body, this.getOptions());
    }

    removeFavorite(restaurantId: number, userId: number) {
        return this.http.delete(this.apiConfig.SAVED_RESTAURANTS_API + "/delete?restaurantId=" + restaurantId + "&userId=" + userId,
            this.getOptions()
        );
    }

    getFavoriteListFiltered(email: string, body) {
        return this.http.post<RestaurantModel[]>(this.apiConfig.RESTAURANT_API + "/favoriteListFiltered?email=" + email, body);
    }

    getFavoriteListNames(email: string) {
        return this.http.get<string[]>(this.apiConfig.RESTAURANT_API + "/favoriteNames?email=" + email);
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
