import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PersonBasicInfoModel} from "../../../models/personBasicInfo.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {ReviewService} from "../../../services/review.service";
import {CookieService} from "ngx-cookie-service";
import {PersonService} from "../../../services/person.service";
import {RecipeModel} from "../../../models/recipe.model";
import {RecipeService} from "../../../services/recipe.service";

@Component({
  selector: 'profile-recipes',
  templateUrl: './profile-recipes.component.html',
  styleUrls: ['./profile-recipes.component.scss']
})
export class ProfileRecipesComponent implements OnInit {

    user: PersonBasicInfoModel;

    isMobile: boolean;

    recipes: RecipeModel[];

    constructor(private responsive: BreakpointObserver,
                private reviewService: ReviewService,
                private cookieService: CookieService,
                private recipeService: RecipeService,
                private personService: PersonService) {
    }

    ngOnInit(): void {
        this.responsive.observe(Breakpoints.HandsetPortrait)
            .subscribe(result => {
                this.isMobile = result.matches;
            });

        this.getCurrentUser();
    }

    getCurrentUser() {
        this.personService.getPersonDetails(this.cookieService.get("emailAddress")).subscribe(data => {
            this.user = data;
            console.log(data);
            this.getRecipes();
        })
    }

    getRecipes() {
        this.recipeService.getRecipesForUser(this.user.username).subscribe(data => {
            this.recipes = data;
            console.log(data);
        })
    }
}
