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

@Component({
    selector: 'app-recipe-view',
    templateUrl: './recipe-view.component.html',
    styleUrls: ['./recipe-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class RecipeViewComponent implements OnChanges {

    @Input()
    recipe: RecipeModel;

    @Input()
    public value() {
        this.resetReviewWindow();
    }

    reviews: ReviewModel[] = new Array<ReviewModel>;

    userLogged: boolean = false;

    insertNewReviewWindow: boolean = false;

    givenStars: number = 0;
    title: string;
    content: string;

    constructor(private reviewService: ReviewService,
                private cookieService: CookieService) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.reviewService.getReviewsForRecipe(this.recipe.id).subscribe(data => {
            this.reviews = data;

            this.updateRecipeRating();
        })

        this.checkLogin();
    }

    checkLogin() {

        console.log(this.userLogged);
        console.log(this.cookieService.get('token'))

        if (this.cookieService.get('token') != "") {
            this.userLogged = true;
        }

        console.log(this.userLogged);
    }

    updateRecipeRating() {

        let sum = 0;

        for (let review of this.reviews) {
            sum += review.rating;
        }

        this.recipe.rating = sum / this.reviews.length;
    }

    toogleCreateReviewWindow() {
        this.insertNewReviewWindow = true;
    }

    resetReviewWindow() {
        this.insertNewReviewWindow = false;
        this.givenStars = 0;
        this.title = "";
        this.content = "";
    }
}
