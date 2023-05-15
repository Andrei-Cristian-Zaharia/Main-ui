import {Component} from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {RestaurantModel} from "../../models/restaurant.model";
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";
import {PersonService} from "../../services/person.service";
import {CookieService} from "ngx-cookie-service";
import {RateTypeEnum} from "../../enums/rateType.enum";
import {ActivatedRoute, Router} from "@angular/router";
import {SaveEntityFormModel} from "../../models/saveEntityFormModel";

@Component({
    selector: 'app-restaurants',
    templateUrl: './restaurants.component.html',
    styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent {

    restaurants: RestaurantModel[];

    user: PersonBasicInfoModel;

    favoriteNames: string[];
    showFavorites: boolean;
    rateType = RateTypeEnum;

    filterRestaurantName: string = "";
    filterRestaurantAddress: string = "";
    showPublic: boolean = true;
    filterRating: number = 0;

    isLoaded: boolean = false;

    constructor(private restaurantService: RestaurantService,
                private personService: PersonService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private cookieService: CookieService) {

        this.getCurrentUser();
    }

    refreshRestaurants() {
        this.activatedRoute.queryParamMap.subscribe(params => {

            if (this.user != null && this.activatedRoute.snapshot.queryParams['favorites'] && params.get('favorites') === 'show') {
                this.showFavorites = true;
                this.restaurantService.getFavoriteListFiltered(this.user.emailAddress, this.formFilters()).subscribe(data => {
                    this.restaurants = data;
                    this.verifyFavorites();
                })
            } else {
                this.showFavorites = false;
                this.getRestaurants();
            }
        });
    }

    getRestaurants() {
        this.restaurantService.getRestaurantsFiltered(this.formFilters()).subscribe(data => {
            this.restaurants = data;

            if (this.user != null) {
                this.verifyFavorites();
            } else {
                this.isLoaded = true;
            }
        })
    }

    formFilters() {
        return {
            filterName: this.filterRestaurantName,
            filterAddress: this.filterRestaurantAddress,
            showActive: this.showPublic,
            rating: this.filterRating
        }
    }

    getCurrentUser() {
        if (this.cookieService.get('emailAddress') != null) {
            this.personService.getPersonDetails(this.cookieService.get('emailAddress')).subscribe(data => {
                this.user = data
                this.refreshFavoriteNames();
            });
        } else {
            this.refreshRestaurants();
        }
    }

    refreshFavoriteNames() {
        this.restaurantService.getFavoriteListNames(this.user.emailAddress).subscribe(data => {
            this.favoriteNames = data
            this.refreshRestaurants();
        });
    }

    verifyFavorites() {
        if (this.favoriteNames != undefined) {
            this.restaurants.forEach(restaurant => {
                restaurant.saved = this.favoriteNames.includes(restaurant.name);
                this.isLoaded = true;
            })
        }
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
        this.router.navigate(['/restaurants'], {queryParams: {favorites: 'show'}});
    }

    goToAllRestaurants() {
        this.router.navigate(['/restaurants']);
    }
}
