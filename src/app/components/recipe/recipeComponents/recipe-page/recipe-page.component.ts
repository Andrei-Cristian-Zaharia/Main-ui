import {Component, OnInit, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {ReviewModel} from "../../../../models/review.model";
import {ReviewService} from "../../../../services/review.service";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {RecipeModel} from "../../../../models/recipe.model";
import {RecipeService} from "../../../../services/recipe.service";
import {RateTypeEnum} from "../../../../enums/rateType.enum";
import {EntityTypeEnum} from "../../../../enums/entityType.enum";

@Component({
    selector: 'app-recipe-page',
    templateUrl: './recipe-page.component.html',
    styleUrls: ['./recipe-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class RecipePageComponent implements OnInit {

    recipe: RecipeModel;

    rateType = RateTypeEnum;
    entityType = EntityTypeEnum;

    constructor(private reviewService: ReviewService,
                private cookieService: CookieService,
                private recipeService: RecipeService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
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

    goToProfile(username) {
        this.router.navigateByUrl('profile?name=' + username);
    }
}
