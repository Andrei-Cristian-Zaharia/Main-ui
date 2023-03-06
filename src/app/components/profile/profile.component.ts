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

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
    encapsulation : ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit{

    user: PersonDetailsModel;
    restaurant: RestaurantModel;
    recipes: RecipeModel[];
    reviews: ReviewModel[];
    rateType = RateTypeEnum;

    constructor(private activatedRoute: ActivatedRoute,
                private reviewService: ReviewService,
                private personService: PersonService,
                private recipeService: RecipeService,
                private restaurantService: RestaurantService,
                private router: Router) {}

    ngOnInit(): void {
        this.activatedRoute.queryParamMap.subscribe(params => {

            this.personService.getPersonDetailsByUsername(params.get('name')).subscribe(data => {
                this.user = data;
                console.log(data);

                this.getRestaurant();
                this.getRecipes();
                this.getReviews();
            }, () => console.log("There was an error and user with username " + params.get('name') + " couldn't be fetched..."));
        })
    }

    getRestaurant() {
        if (this.user.hasRestaurant) {
            this.restaurantService.getRestaurantForUser(this.user.username).subscribe(result => {
                this.restaurant = result;
                console.log(result);
            })
        }
    }

    getReviews() {
        this.reviewService.getReviewsForUser(this.user.emailAddress).subscribe(result => {
            this.reviews = result;
            console.log(result);
        })
    }

    getRecipes() {
        this.recipeService.getRecipesForUser(this.user.username).subscribe(result => {
            this.recipes = result;
            console.log(result);
        })
    }

    goToRestaurant(name: string) {
        this.router.navigateByUrl('restaurant?name=' + name);
    }

    goToRecipePage(name: string) {
        this.router.navigateByUrl('recipe?name=' + name);
    }
}
