import {PersonModel} from "./person.model";

export class ReviewModel {

    id: number;
    title: string;
    text: string;
    rating: number;
    creationDate: Date;
    category: string;
    entityName: string;
    person: PersonModel;
}
