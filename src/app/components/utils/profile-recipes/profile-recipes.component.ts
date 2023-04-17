import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewEncapsulation
} from '@angular/core';
import {PersonBasicInfoModel} from "../../../models/personBasicInfo.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {ReviewService} from "../../../services/review.service";
import {CookieService} from "ngx-cookie-service";
import {PersonService} from "../../../services/person.service";
import {RecipeModel} from "../../../models/recipe.model";
import {RecipeService} from "../../../services/recipe.service";
import {RateTypeEnum} from "../../../enums/rateType.enum";
import {SaveRecipeFormModel} from "../../../models/saveRecipeForm.model";
import {Router} from "@angular/router";

@Component({
    selector: 'profile-recipes',
    templateUrl: './profile-recipes.component.html',
    styleUrls: ['./profile-recipes.component.scss']
})
export class ProfileRecipesComponent implements OnInit {

    user: PersonBasicInfoModel;

    isMobile: boolean;

    rateType = RateTypeEnum;

    @Input()
    recipes: RecipeModel[];

    @Input()
    width: number = 30;

    @Input()
    height: number = 30;

    @Input()
    headerSize: number = 11;

    @Input()
    type: string = "VIEW";

    @Output()
    favoriteListUpdated = new EventEmitter<boolean>();

    mobileWidth = 22;
    mobileHeight = 12;
    mobileHeaderSize = 8.75;

    initialWidth: number;
    initialHeight: number;
    initialHeaderSize: number;

    viewRecipeDialog: boolean;
    selectedRecipe: RecipeModel;

    createRecipeDialog: boolean = false;

    constructor(private responsive: BreakpointObserver,
                private reviewService: ReviewService,
                private cookieService: CookieService,
                private recipeService: RecipeService,
                private personService: PersonService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.initialWidth = this.width;
        this.initialHeight = this.height;
        this.initialHeaderSize = this.headerSize;

        this.responsive.observe(Breakpoints.HandsetPortrait)
            .subscribe(result => {
                this.isMobile = result.matches;

                if (!this.isMobile && this.type == 'VIEW') {
                    this.width = this.initialWidth;
                    this.height = this.initialHeight;
                    this.headerSize = this.initialHeaderSize;
                } else {
                    if (this.type != 'EDIT'){
                        this.width = this.mobileWidth;
                        this.height = this.mobileHeight;
                        this.headerSize = this.mobileHeaderSize;
                    }
                }
            });

        if (this.recipes == null) {
            this.getCurrentUser();
        }

        // if (this.type == "VIEW") {
        //     this.getCurrentUser();
        // }
    }

    showViewRecipeDialog(recipe) {
        if (this.isMobile) {
            this.router.navigateByUrl('recipe?name=' + recipe.name);
            return;
        }

        this.selectedRecipe = recipe;

        recipe.description = recipe.description.replaceAll('\n', '<br>');
        recipe.howToPrepare = recipe.howToPrepare.replaceAll('\n', '<br>');

        let imageWithClass = '<img class="view-photo"';

        recipe.description = recipe.description.replaceAll(
            '<img',
            imageWithClass
        ).replaceAll("\\/", '');

        this.viewRecipeDialog = true;
    }

    getCurrentUser() {
        this.personService.getPersonDetails(this.cookieService.get("emailAddress")).subscribe(data => {
            this.user = data;

            if (this.type == "EDIT") {
                this.getRecipes();
            }
        })
    }

    getRecipes() {
        this.recipeService.getRecipesForUser(this.user.username).subscribe(data => {
            this.recipes = data;
        })
    }

    updateUserSaveList(saveForm: SaveRecipeFormModel) {

        if (saveForm.type == "ADD") {
            this.recipeService.addFavorite(saveForm.recipeId, this.user.id).subscribe(data =>
                this.refreshFavoriteNames(true)
            );
        }
        else if (saveForm.type == "REMOVE") {
            this.recipeService.removeFavorite(saveForm.recipeId, this.user.id).subscribe(data =>
                this.refreshFavoriteNames(true)
            );
        }
    }

    refreshFavoriteNames(value: boolean) {
        this.favoriteListUpdated.emit(value);
    }

    showCreateRecipeDialog(recipe: RecipeModel) {
        this.selectedRecipe = recipe;
        this.createRecipeDialog = true;
    }

    hideCreateRecipeDialog() {
        this.createRecipeDialog = false;
        this.getRecipes();
    }
}
