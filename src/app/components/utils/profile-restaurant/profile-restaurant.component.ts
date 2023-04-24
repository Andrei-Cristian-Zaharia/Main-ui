import {Component, Input, OnInit} from '@angular/core';
import {RestaurantModel} from "../../../models/restaurant.model";
import {RateTypeEnum} from "../../../enums/rateType.enum";
import {PersonBasicInfoModel} from "../../../models/personBasicInfo.model";
import {BreakpointObserver} from "@angular/cdk/layout";
import {CookieService} from "ngx-cookie-service";
import {PersonService} from "../../../services/person.service";
import {Router} from "@angular/router";
import {RestaurantService} from "../../../services/restaurant.service";

@Component({
    selector: 'profile-restaurant',
    templateUrl: './profile-restaurant.component.html',
    styleUrls: ['./profile-restaurant.component.scss']
})
export class ProfileRestaurantComponent implements OnInit {

    @Input()
    restaurant: RestaurantModel;

    @Input()
    user: PersonBasicInfoModel;

    isMobile: boolean;

    rateType = RateTypeEnum;

    isLoaded: boolean = false;

    constructor(private responsive: BreakpointObserver,
                private cookieService: CookieService,
                private restaurantService: RestaurantService,
                private personService: PersonService,
                private router: Router) {
    }

    ngOnInit(): void {
        if (this.user.hasRestaurant) {
            this.getRestaurant();
        }
    }

    getRestaurant() {
        if (this.user.hasRestaurant) {
            this.restaurantService.getRestaurantForUser(this.user.username).subscribe(result => {
                this.restaurant = result;
                this.isLoaded = true;
            })
        }
    }

    goToRestaurant(name: string) {
        this.router.navigateByUrl('restaurant?name=' + name);
    }
}
