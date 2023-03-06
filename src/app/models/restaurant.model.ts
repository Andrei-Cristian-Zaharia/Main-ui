import {PersonModel} from "./person.model";
import {BaseEntityModel} from "./baseEntity.model";

export class RestaurantModel extends BaseEntityModel{
    name: string;
    description: string;
    frontImage: string;
    address: string;
    partnerSince: Date;
    owner: PersonModel;

    constructor() {
        super("RESTAURANT");
    }
}
