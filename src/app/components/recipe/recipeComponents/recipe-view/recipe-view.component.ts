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

@Component({
    selector: 'app-recipe-view',
    templateUrl: './recipe-view.component.html',
    styleUrls: ['./recipe-view.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class RecipeViewComponent implements OnChanges {

    @Input()
    recipe: RecipeModel;

    reviews: ReviewModel[] = new Array<ReviewModel>;

    userLogged: boolean = false;

    insertNewReviewWindow: boolean = false;

    userAlreadyPosted: boolean = false;

    givenStars: number = 0;
    title: string;
    content: string;

    constructor(private reviewService: ReviewService,
                private cookieService: CookieService,
                private router: Router) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.refreshReviews();
        this.resetReview();
        this.checkLogin();
        this.checkPostReview();
    }

    resetReview() {
        this.insertNewReviewWindow = false;
        this.title = "";
        this.content = "";
        this.givenStars = 0;
    }

    refreshReviews() {
        this.reviewService.getReviewsForRecipe(this.recipe.id).subscribe(data => {
            this.reviews = data;
            console.log(data);

            this.updateRecipeRating();
        })
    }

    checkLogin() {
        if (this.cookieService.get('token') != "") {
            this.userLogged = true;
        }
    }

    checkPostReview() {
        this.reviewService.checkReviewFromUserOnRecipe(this.cookieService.get('emailAddress'), this.recipe.id)
            .subscribe(data => {
                this.userAlreadyPosted = data;
            })
    }

    updateRecipeRating() {

        let sum = 0;

        for (let review of this.reviews) {
            sum += review.rating;
        }

        this.recipe.rating = sum / this.reviews.length;
    }

    toggleCreateReviewWindow() {
        this.insertNewReviewWindow = true;
    }

    createReview() {

        let review = {
            "title": this.title,
            "text": this.content,
            "rating": this.givenStars,
            "category": "RECIPE",
            "ownerEmail": this.cookieService.get('emailAddress'),
            "recipeId": this.recipe.id
        }

        this.reviewService.createNewReview(review).subscribe(result => {
            this.updateRecipeRating();
            this.refreshReviews();
            this.resetReview();
        });
    }

    goToProfile(username) {
        this.router.navigateByUrl('profile?name=' + username);
    }

    goToRecipePage(recipe) {
        this.router.navigateByUrl('recipe?name=' + recipe);
    }
}
