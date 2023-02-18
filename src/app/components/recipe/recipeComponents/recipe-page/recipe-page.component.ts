import {Component, OnInit, SimpleChanges} from '@angular/core';
import {ReviewModel} from "../../../../models/review.model";
import {ReviewService} from "../../../../services/review.service";
import {CookieService} from "ngx-cookie-service";
import {ActivatedRoute, Router} from "@angular/router";
import {RecipeModel} from "../../../../models/recipe.model";
import {RecipeService} from "../../../../services/recipe.service";

@Component({
    selector: 'app-recipe-page',
    templateUrl: './recipe-page.component.html',
    styleUrls: ['./recipe-page.component.scss']
})
export class RecipePageComponent implements OnInit {

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
                private recipeService: RecipeService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.getRecipe();

    }

    init() {
        this.refreshReviews();
        this.resetReview();
        this.checkLogin();
        this.checkPostReview();
    }

    getRecipe() {
        this.activatedRoute.queryParamMap.subscribe(params => {
            this.recipeService.getRecipeByName(params.get('name')).subscribe(result => {
                this.recipe = RecipePageComponent.reformatRecipeInfo(result);
                this.init();
            });
        });
    }

    private static reformatRecipeInfo(recipe: RecipeModel): RecipeModel {
        recipe.description = recipe.description.replaceAll('\n', '<br>');
        recipe.howToPrepare = recipe.howToPrepare.replaceAll('\n', '<br>');

        // let imageWithClass = '<img class="view-photo"';
        // console.log(recipe.howToPrepare);
        // recipe.howToPrepare = recipe.howToPrepare.replaceAll(
        //     '<img',
        //     imageWithClass
        // ).replaceAll("\\/", '');
        return recipe;
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
}
