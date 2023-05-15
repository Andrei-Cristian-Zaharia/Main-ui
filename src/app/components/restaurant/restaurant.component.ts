import {Component, Input} from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {RestaurantModel} from "../../models/restaurant.model";
import {ActivatedRoute} from "@angular/router";
import {RateTypeEnum} from "../../enums/rateType.enum";
import {EntityTypeEnum} from "../../enums/entityType.enum";
import {ReviewTypeEnum} from "../../enums/reviewType.enum";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent {

    @Input()
    restaurant: RestaurantModel;

    rateType = RateTypeEnum;
    entityType = EntityTypeEnum;
    reviewType = ReviewTypeEnum;

    displayMenu: boolean = false;
    displayOverview: boolean = true;

    isOwner: boolean = false;

    constructor(private restaurantService: RestaurantService,
                private cookieService: CookieService,
                private activatedRoute: ActivatedRoute) {
        this.getRestaurantInfo();
    }

    getRestaurantInfo() {
        if (this.restaurant != null) {
            this.restaurantService.getRestaurantByName(this.restaurant.name).subscribe(data => {
                this.restaurant = data;
                this.checkOwner();
            })
        }

        this.activatedRoute.queryParamMap.subscribe(params => {
            this.restaurantService.getRestaurantByName(params.get('name')).subscribe(data => {
                this.restaurant = data;
                this.checkOwner();
            })
        });
    }

    checkOwner() {
        if (this.cookieService.get('username') === this.restaurant.owner.username) {
            this.isOwner = true;
        }
    }

    updateRestaurantRating(rating: number) {
        this.restaurant.rating = rating;
    }

    showMenu() {
        this.displayMenu = true;
        this.displayOverview = false;
    }

    showOverview() {
        this.displayMenu = false;
        this.displayOverview = true;
    }

    openLink(link: string) {
        window.open(link);
    }
}
