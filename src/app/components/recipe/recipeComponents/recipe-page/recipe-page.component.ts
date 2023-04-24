import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {RecipeModel} from "../../../../models/recipe.model";
import {RecipeService} from "../../../../services/recipe.service";

@Component({
    selector: 'app-recipe-page',
    templateUrl: './recipe-page.component.html',
    styleUrls: ['./recipe-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RecipePageComponent implements OnInit {

    recipe: RecipeModel;

    constructor(private recipeService: RecipeService,
                private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.getRecipe();
    }

    getRecipe() {
        this.activatedRoute.queryParamMap.subscribe(params => {
            this.recipeService.getRecipeByName(params.get('name')).subscribe(result => {
                this.recipe = RecipePageComponent.reformatRecipeInfo(result);
            });
        });
    }

    private static reformatRecipeInfo(recipe: RecipeModel): RecipeModel {
        recipe.description = recipe.description.replaceAll('\n', '<br>');
        recipe.howToPrepare = recipe.howToPrepare.replaceAll('\n', '<br>');

        return recipe;
    }
}
