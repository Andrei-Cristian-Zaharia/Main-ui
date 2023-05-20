import {Component, Input} from '@angular/core';
import {RestaurantService} from "../../services/restaurant.service";
import {RestaurantModel} from "../../models/restaurant.model";
import {ActivatedRoute} from "@angular/router";
import {RateTypeEnum} from "../../enums/rateType.enum";
import {EntityTypeEnum} from "../../enums/entityType.enum";
import {ReviewTypeEnum} from "../../enums/reviewType.enum";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "../../services/auth.service";
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";

@Component({
  selector: 'restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent {

    @Input()
    restaurant: RestaurantModel;

    @Input()
    openFromView: boolean = false;

    rateType = RateTypeEnum;
    entityType = EntityTypeEnum;
    reviewType = ReviewTypeEnum;

    displayMenu: boolean = false;
    displayOverview: boolean = true;
    openMediaInfo: boolean = false;

    isOwner: boolean = false;

    user: PersonBasicInfoModel = null;

    keysPressed = {};

    imageComponent: string = "<img src=\"insert-image-source\">";

    preview: boolean = false;

    constructor(private restaurantService: RestaurantService,
                private cookieService: CookieService,
                private authService: AuthService,
                private activatedRoute: ActivatedRoute) {
        this.getRestaurantInfo();
        this.getCurrentUser();
    }

    getCurrentUser() {
        this.authService.getUser(null).subscribe(data => {
            this.user = data;

            if (this.user.username === this.restaurant.owner.username) {
                this.isOwner = true;
            }
        });
    }

    getRestaurantInfo() {
        if (this.restaurant != null) {
            this.restaurantService.getRestaurantByName(this.restaurant.name).subscribe(data => {
                this.restaurant = data;
                this.getCurrentUser();
            })
        }

        this.activatedRoute.queryParamMap.subscribe(params => {
            this.restaurantService.getRestaurantByName(params.get('name')).subscribe(data => {
                this.restaurant = data;
            })
        });
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

    saveRestaurant(){
        let body = {
            id: this.restaurant.id,
            description: this.restaurant.description,
            pageText: this.restaurant.pageText,
            employmentText: this.restaurant.employAnnounce,
            frontImage: this.restaurant.frontImage,
            bannerImage: this.restaurant.bannerImage,
            instagramLink: this.restaurant.instagramLink,
            facebookLink: this.restaurant.facebookLink,
            webLink: this.restaurant.websiteAddress,
            address: this.restaurant.addressLocation
        }

        this.restaurantService.saveRestaurantPage(body).subscribe();
    }

    clearPressedKeys() {
        this.keysPressed = new Map();
    }

    formatText(event)  {
        let target = event.target || event.srcElement;
        const textArea = document.getElementById(target.id) as HTMLTextAreaElement;
        let startPos = textArea.selectionStart;
        let endPos = textArea.selectionEnd;

        this.keysPressed[event.key] = true;

        if (event.key === "i" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + this.imageComponent;
        }

        if (event.key === "b" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<b>"
                + textArea.value.substring(startPos, endPos) + "</b>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "1" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h1>"
                + textArea.value.substring(startPos, endPos) + "</h1>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "2" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h2>"
                + textArea.value.substring(startPos, endPos) + "</h2>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "3" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h3>"
                + textArea.value.substring(startPos, endPos) + "</h3>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "4" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h4>"
                + textArea.value.substring(startPos, endPos) + "</h4>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "5" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h5>"
                + textArea.value.substring(startPos, endPos) + "</h5>"
                + textArea.value.substring(endPos, textArea.textLength);
        }
    }
}
