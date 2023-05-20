import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RestaurantService} from "../../../services/restaurant.service";
import {PersonBasicInfoModel} from "../../../models/personBasicInfo.model";

@Component({
  selector: 'create-restaurant',
  templateUrl: './create-restaurant.component.html',
  styleUrls: ['./create-restaurant.component.scss']
})
export class CreateRestaurantComponent {

    @Input()
    owner: PersonBasicInfoModel = null;

    @Output()
    closeDialog = new EventEmitter<boolean>();

    restaurantName: string = "";
    instagramLink: string = "";
    facebookLink: string = "";
    webLink: string = "";
    address: string = "";
    frontImage: string = "";
    bannerImage: string = "";
    phoneNumber: string = "";
    emailAddress: string = "";

    constructor(private restaurantService: RestaurantService) {}

    createRestaurant() {
        let restaurant = {
            "name": this.restaurantName,
            "instagramLink": this.instagramLink,
            "facebookLink": this.facebookLink,
            "websiteAddress": this.webLink,
            "frontImage": this.frontImage,
            "bannerImage": this.bannerImage,
            "telephone": this.phoneNumber,
            "addressLocation": this.address,
            "emailAddress": this.emailAddress,
            "person_id": this.owner.id
        }

        this.restaurantService.createRestaurant(restaurant).subscribe(data => {
            this.resetInputs()
            this.closeDialog.emit(true);
        });
    }

    resetInputs() {
        this.restaurantName = "";
        this.instagramLink = "";
        this.facebookLink = "";
        this.webLink = "";
        this.address = "";
        this.frontImage = "";
        this.bannerImage = "";
        this.phoneNumber = "";
        this.emailAddress = "";
    }
}

