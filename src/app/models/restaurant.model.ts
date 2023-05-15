import {PersonModel} from "./person.model";
import {BaseEntityModel} from "./baseEntity.model";
import {MenuModel} from "./menu.model";

export class RestaurantModel extends BaseEntityModel{
    name: string;
    description: string;
    employAnnounce: string;
    pageText: string;
    frontImage: string;
    bannerImage: string;
    telephone: string;
    emailAddress: string;
    websiteAddress: string;
    addressLocation: string;
    status: string;
    schedule: string;
    instagramLink: string;
    facebookLink: string;
    partnerSince: Date;
    menu: MenuModel;
    owner: PersonModel;
    rating: number;

    constructor() {
        super("RESTAURANT", false);
    }
}
