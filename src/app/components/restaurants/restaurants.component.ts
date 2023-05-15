import { Component } from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {RestaurantModel} from "../../models/restaurant.model";
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";
import {PersonService} from "../../services/person.service";
import {CookieService} from "ngx-cookie-service";
import {RateTypeEnum} from "../../enums/rateType.enum";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent {

    restaurants: RestaurantModel[];

    user: PersonBasicInfoModel;

    showFavorites: boolean = false;
    rateType = RateTypeEnum;

    filterRestaurantName: string = "";
    filterRestaurantAddress: string = "";
    showPublic: boolean = true;
    filterRating: number = 0;

    constructor(private restaurantService: RestaurantService,
                private personService: PersonService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private cookieService: CookieService) {
        this.refreshRestaurants();
        this.getCurrentUser();
    }

    refreshRestaurants() {
        this.activatedRoute.queryParamMap.subscribe(params => {

            if (this.user != null && this.activatedRoute.snapshot.queryParams['favorites'] && params.get('favorites') === 'show') {
                this.showFavorites = false;
                this.restaurantService.getRestaurantsFiltered(this.formFilters()).subscribe(data => {
                    this.restaurants = data;
                })
            } else {
                this.showFavorites = true;
                this.getRestaurants();
            }
        });
    }

    getRestaurants() {
        this.restaurantService.getRestaurantsFiltered(this.formFilters()).subscribe(data => {
            this.restaurants = data;
        })
    }

    formFilters() {
        let body = {
            filterName: this.filterRestaurantName,
            filterAddress: this.filterRestaurantAddress,
            showActive: this.showPublic,
            rating: this.filterRating
        }

        return body
    }

    getCurrentUser() {
        if (this.cookieService.get('emailAddress') != null) {
            this.personService.getPersonDetails(this.cookieService.get('emailAddress')).subscribe(data => {
                this.user = data

                this.refreshFavoriteNames();
                console.log(this.user)
            });
        } else {
            this.refreshRestaurants();
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

        this.refreshRestaurants();
    }

    updateRatingFilter(rate: number) {
        this.filterRating = rate;

        this.refreshRestaurants();
    }

    goToFavouriteRestaurants() {
        this.router.navigate(['/restaurants'], { queryParams: {favorites:'show'}});
    }
}
