import {
    Component,
    Input, OnInit,
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
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";

@Component({
    selector: 'recipe-view',
    templateUrl: './recipe-view.component.html',
    styleUrls: ['./recipe-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class RecipeViewComponent implements OnInit {

    @Input()
    recipe: RecipeModel;

    @Input()
    type: string;

    reviews: ReviewModel[] = new Array<ReviewModel>;

    userLogged: boolean = false;

    rateType = RateTypeEnum;
    entityType = EntityTypeEnum;
    reviewType = ReviewTypeEnum;

    isMobile: boolean = false;

    constructor(private reviewService: ReviewService,
                private cookieService: CookieService,
                private recipeService: RecipeService,
                private responsive: BreakpointObserver,
                private router: Router) { }

    ngOnInit(): void {
        this.responsive.observe(Breakpoints.HandsetPortrait)
            .subscribe(result => {
                this.isMobile = result.matches;
            });
    }

    updateRecipeRating(rating: number) {
        this.recipe.rating = rating;
    }

    goToRecipePage(recipe) {
        this.router.navigateByUrl('recipe?name=' + recipe);
    }
}
