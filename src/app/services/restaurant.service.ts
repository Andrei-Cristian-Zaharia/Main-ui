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

    getOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: this.authService.getToken()
            })
        };
    }
}
