import {Component, OnInit} from '@angular/core';
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {PersonService} from "../../services/person.service";
import {CookieService} from "ngx-cookie-service";
import {ReviewService} from "../../services/review.service";
import {RecipeService} from "../../services/recipe.service";
import {ReviewTypeEnum} from "../../enums/reviewType.enum";

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

    user: PersonBasicInfoModel;
    isMobile: boolean;
    isMidSize: boolean;

    reviewsNumber: number = 0;
    recipesNumber: number = 0;
    averageRate: number = 0;

    reviewType = ReviewTypeEnum;

    constructor(private responsive: BreakpointObserver,
                private personService: PersonService,
                private reviewService: ReviewService,
                private recipeService: RecipeService,
                private cookieService: CookieService) {
    }

    ngOnInit(): void {
        this.responsive.observe(Breakpoints.HandsetPortrait)
            .subscribe(result => {
                this.isMobile = result.matches;
            });

        this.responsive.observe(Breakpoints.TabletLandscape)
            .subscribe(result => {
                this.isMidSize = result.matches;
            });

        this.getCurrentUser();
        this.countUserReviewsNumber();
        this.countUserRecipes();
        this.getAveragesRateForUser();
    }

    getCurrentUser() {
        this.personService.getPersonDetails(this.cookieService.get('emailAddress')).subscribe(data => {
            this.user = data
        });
    }

    countUserReviewsNumber() {
        this.reviewService.countUserReviews(this.cookieService.get('emailAddress')).subscribe(data => {
            this.reviewsNumber = data;
        })
    }

    countUserRecipes() {
        this.recipeService.countUserRecipes(this.cookieService.get('emailAddress')).subscribe(data => {
            this.recipesNumber = data;
        })
    }

    getAveragesRateForUser() {
        this.reviewService.averageRateUser(this.cookieService.get('emailAddress')).subscribe(data => {
            this.averageRate = data;
        })
    }

    createRestaurant() {

    }

    goToRestaurant() {

    }
}
