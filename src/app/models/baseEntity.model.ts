export class BaseEntityModel {
    id: number;
    category: string = "";

    constructor(category: string) {
        this.category = category;
    }
}
