import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PersonService} from "../../services/person.service";
import {PersonDetailsModel} from "../../models/personDetails.model";
import {ReviewModel} from "../../models/review.model";
import {ReviewService} from "../../services/review.service";
import {RecipeService} from "../../services/recipe.service";
import {RecipeModel} from "../../models/recipe.model";
import {RateTypeEnum} from "../../enums/rateType.enum";
import {RestaurantModel} from "../../models/restaurant.model";
import {RestaurantService} from "../../services/restaurant.service";
import {CookieService} from "ngx-cookie-service";
import {ReviewTypeEnum} from "../../enums/reviewType.enum";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
    encapsulation : ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit{

    user: PersonDetailsModel;
    restaurant: RestaurantModel;
    reviews: ReviewModel[];
    rateType = RateTypeEnum;
    recipes: RecipeModel[];

    reviewsNumber: number = 0;
    recipesNumber: number = 0;
    averageRate: number = 0;

    reviewType = ReviewTypeEnum;

    constructor(private activatedRoute: ActivatedRoute,
                private personService: PersonService,
                private reviewService: ReviewService,
                private recipeService: RecipeService,
                private restaurantService: RestaurantService,
                private cookieService: CookieService,
                private router: Router) {}

    ngOnInit(): void {
        this.activatedRoute.queryParamMap.subscribe(params => {

            this.personService.getPersonDetailsByUsername(params.get('name')).subscribe(data => {
                this.user = data;

                this.getRestaurant();
                this.getRecipes();
                this.getAveragesRateForUser();
                this.countUserReviewsNumber();
                this.countUserRecipes();
            }, () => console.log("There was an error and user with username " + params.get('name') + " couldn't be fetched..."));
        })
    }

    getRestaurant() {
        if (this.user.hasRestaurant) {
            this.restaurantService.getRestaurantForUser(this.user.username).subscribe(result => {
                this.restaurant = result;
            })
        }
    }

    getRecipes() {
        let body = {
            "authorName": this.user.username,
            "status" : 'APPROVED'
        }

        this.recipeService.getRecipesFilteredByIngredients(body).subscribe(data => {
            this.recipes = data;
        })
    }

    countUserReviewsNumber() {
        this.reviewService.countUserReviews(this.user.username).subscribe(data => {
            this.reviewsNumber = data;
        })
    }

    countUserRecipes() {
        this.recipeService.countUserRecipes(this.user.username).subscribe(data => {
            this.recipesNumber = data;
        })
    }

    getAveragesRateForUser() {
        this.reviewService.averageRateUser(this.user.username).subscribe(data => {
            this.averageRate = data;
        })
    }

    goToRestaurant(name: string) {
        this.router.navigateByUrl('restaurant?name=' + name);
    }
}
