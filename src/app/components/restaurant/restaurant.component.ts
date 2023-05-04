import { Component } from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {RestaurantModel} from "../../models/restaurant.model";
import {ActivatedRoute} from "@angular/router";
import {RateTypeEnum} from "../../enums/rateType.enum";
import {EntityTypeEnum} from "../../enums/entityType.enum";
import {ReviewTypeEnum} from "../../enums/reviewType.enum";

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent {

    restaurant: RestaurantModel;

    rateType = RateTypeEnum;
    entityType = EntityTypeEnum;
    reviewType = ReviewTypeEnum;

    constructor(private restaurantService: RestaurantService,
                private activatedRoute: ActivatedRoute) {
        this.getRestaurantInfo();
    }

    getRestaurantInfo() {
        this.activatedRoute.queryParamMap.subscribe(params => {
            this.restaurantService.getRestaurantByName(params.get('name')).subscribe(data => {
                this.restaurant = data;
            })
        });
    }

    updateRestaurantRating(rating: number) {
        this.restaurant.rating = rating;
    }

    openLink(link: string) {
        window.open(link);
    }
}
