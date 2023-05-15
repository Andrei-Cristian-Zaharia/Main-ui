export class BaseEntityModel {
    id: number;
    saved: boolean;
    category: string = "";

    constructor(category: string) {
        this.category = category;
    }
}
