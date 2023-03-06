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

@Component({
    selector: 'app-recipe-view',
    templateUrl: './recipe-view.component.html',
    styleUrls: ['./recipe-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class RecipeViewComponent {

    @Input()
    recipe: RecipeModel;

    reviews: ReviewModel[] = new Array<ReviewModel>;

    userLogged: boolean = false;

    rateType = RateTypeEnum;
    entityType = EntityTypeEnum;

    constructor(private reviewService: ReviewService,
                private cookieService: CookieService,
                private router: Router) { }

    updateRecipeRating(rating: number) {
        console.log(rating)
        this.recipe.rating = rating;
    }

    goToProfile(username) {
        this.router.navigateByUrl('profile?name=' + username);
    }

    goToRecipePage(recipe) {
        this.router.navigateByUrl('recipe?name=' + recipe);
    }
}
