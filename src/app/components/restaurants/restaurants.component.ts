import { Component } from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {RestaurantModel} from "../../models/restaurant.model";
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";
import {PersonService} from "../../services/person.service";
import {CookieService} from "ngx-cookie-service";
import {RateTypeEnum} from "../../enums/rateType.enum";

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent {

    restaurants: RestaurantModel[];

    user: PersonBasicInfoModel;

    showFavorites: boolean = false;
    showPublic: boolean;
    rateType = RateTypeEnum;

    filterRestaurantName: string = "";
    filterRating: number = 0;

    constructor(private restaurantService: RestaurantService,
                private personService: PersonService,
                private cookieService: CookieService) {
        this.getRestaurants();
        this.getCurrentUser();
    }

    getRestaurants() {
        let body = {
            filterName: this.filterRestaurantName,
            rating: this.filterRating
        }

        this.restaurantService.getRestaurantsFiltered(body).subscribe(data => {
            this.restaurants = data;
        })
    }

    getCurrentUser() {
        if (this.cookieService.get('emailAddress') != null) {
            this.personService.getPersonDetails(this.cookieService.get('emailAddress')).subscribe(data => {
                this.user = data

                this.refreshFavoriteNames();
                console.log(this.user)
            });
        } else {
            this.getRestaurants();
        }
    }

    refreshFavoriteNames() {
        // this.recipeService.getFavoriteListNames(this.user.emailAddress).subscribe(data => {
        //     this.favoriteNames = data
        //     this.refreshRecipes();
        // });
    }

    resetRatingFilter(event: MouseEvent) {
        event.preventDefault();
        this.filterRating = 0;

        this.getRestaurants();
    }

    updateRatingFilter(rate: number) {
        this.filterRating = rate;

        this.getRestaurants();
    }
}
