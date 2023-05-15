export class BaseEntityModel {
    id: number;
    saved: boolean = false;
    category: string = "";

    constructor(category: string, saved: boolean) {
        this.category = category;
        this.saved = saved;
    }
}
