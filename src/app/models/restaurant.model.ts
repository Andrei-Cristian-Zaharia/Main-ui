import {PersonModel} from "./person.model";

export class RestaurantModel {
    id: number;
    name: string;
    description: string;
    address: string;
    partnerSince: Date;
    owner: PersonModel;
}
