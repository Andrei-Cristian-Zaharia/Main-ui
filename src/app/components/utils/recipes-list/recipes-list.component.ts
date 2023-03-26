import {Component, Input} from '@angular/core';
import {RecipeModel} from "../../../models/recipe.model";
import {RateTypeEnum} from "../../../enums/rateType.enum";
import {Router} from "@angular/router";

@Component({
    selector: 'recipes-list',
    templateUrl: './recipes-list.component.html',
    styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent {

    @Input()
    recipes: RecipeModel[];

    rateType = RateTypeEnum;

    constructor(private router: Router) {
    }

    goToRecipePage(name: string) {
        this.router.navigateByUrl('recipe?name=' + name);
    }
}
