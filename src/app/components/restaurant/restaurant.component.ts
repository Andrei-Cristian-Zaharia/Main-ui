import { Component } from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {RestaurantModel} from "../../models/restaurant.model";
import {ActivatedRoute} from "@angular/router";
import {RateTypeEnum} from "../../enums/rateType.enum";
import {EntityTypeEnum} from "../../enums/entityType.enum";
import {ReviewTypeEnum} from "../../enums/reviewType.enum";
import {MenuService} from "../../services/menu.service";
import {MenuCategorisedModel} from "../../models/menu.model";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent {

    restaurant: RestaurantModel;
    menu: MenuCategorisedModel;

    rateType = RateTypeEnum;
    entityType = EntityTypeEnum;
    reviewType = ReviewTypeEnum;

    displayMenu: boolean = true;
    displayOverview: boolean = false;

    isOwner: boolean = false;

    constructor(private restaurantService: RestaurantService,
                private menuService: MenuService,
                private cookieService: CookieService,
                private activatedRoute: ActivatedRoute) {
        this.getRestaurantInfo();
    }

    getRestaurantInfo() {
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
            this.getMenu(); // delete this
        }
    }

    getMenu() {
        this.menuService.getCategorisedMenu(this.restaurant.menu.id).subscribe(data => {
            this.menu = data;
            console.log("Menu", this.menu);
        })
    }

    updateRestaurantRating(rating: number) {
        this.restaurant.rating = rating;
    }

    showMenu() {
        this.displayMenu = true;
        this.displayOverview = false;

        if (this.menu === null || this.menu === undefined) {
            this.getMenu();
        }
    }

    showOverview() {
        this.displayMenu = false;
        this.displayOverview = true;
    }

    openLink(link: string) {
        window.open(link);
    }
}
