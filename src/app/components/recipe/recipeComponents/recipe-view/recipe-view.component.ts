import {
    AfterContentInit,
    Component, EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {RecipeModel} from "../../../../models/recipe.model";
import {ReviewService} from "../../../../services/review.service";
import {ReviewModel} from "../../../../models/review.model";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {RateTypeEnum} from "../../../../enums/rateType.enum";
import {EntityTypeEnum} from "../../../../enums/entityType.enum";
import {ReviewTypeEnum} from "../../../../enums/reviewType.enum";
import {RecipeService} from "../../../../services/recipe.service";

@Component({
    selector: 'app-recipe-view',
    templateUrl: './recipe-view.component.html',
    styleUrls: ['./recipe-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class RecipeViewComponent {

    @Input()
    recipe: RecipeModel;

    @Input()
    username: string;

    recipes: RecipeModel[];

    reviews: ReviewModel[] = new Array<ReviewModel>;

    userLogged: boolean = false;

    rateType = RateTypeEnum;
    entityType = EntityTypeEnum;
    reviewType = ReviewTypeEnum;

    constructor(private reviewService: ReviewService,
                private cookieService: CookieService,
                private recipeService: RecipeService,
                private router: Router) { }

    updateRecipeRating(rating: number) {
        this.recipe.rating = rating;
    }

    getRecipes() {
        this.recipeService.getRecipesForUser(this.username).subscribe(result => {
            this.recipes = result;
            console.log(result);
        })
    }

    goToProfile(username) {
        this.router.navigateByUrl('profile?name=' + username);
    }

    goToRecipePage(recipe) {
        this.router.navigateByUrl('recipe?name=' + recipe);
    }
}
