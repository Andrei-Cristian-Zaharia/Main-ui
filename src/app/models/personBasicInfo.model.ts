import {PersonModel} from "./person.model";

export class PersonBasicInfoModel extends PersonModel{

    id: number;
    hasRestaurant: boolean;
    accountType: string;
}
