import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {PersonBasicInfoModel} from "../../../models/personBasicInfo.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {ReviewService} from "../../../services/review.service";
import {CookieService} from "ngx-cookie-service";
import {PersonService} from "../../../services/person.service";
import {RecipeModel} from "../../../models/recipe.model";
import {RecipeService} from "../../../services/recipe.service";
import {RateTypeEnum} from "../../../enums/rateType.enum";
import {SaveEntityFormModel} from "../../../models/saveEntityFormModel";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
    selector: 'recipes-container',
    templateUrl: './recipes-container.component.html',
    styleUrls: ['./recipes-container.component.scss']
})
export class RecipesContainerComponent implements OnInit {

    @Input()
    user: PersonBasicInfoModel;

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

    @Input()
    mobileWidth = 22;

    @Input()
    mobileHeight = 12;

    @Input()
    mobileHeaderSize = 8.75;

    isMobile: boolean;

    rateType = RateTypeEnum;

    initialWidth: number;
    initialHeight: number;
    initialHeaderSize: number;

    viewRecipeDialog: boolean;
    selectedRecipe: RecipeModel;

    createRecipeDialog: boolean = false;

    showApprovedOnly: boolean = false;

    constructor(private responsive: BreakpointObserver,
                private reviewService: ReviewService,
                private cookieService: CookieService,
                private recipeService: RecipeService,
                private personService: PersonService,
                private authService: AuthService,
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
        if (this.cookieService.check('token')) {
            this.authService.getUser(null).subscribe(data => {
                this.user = data;

                if (this.type == "EDIT") {
                    this.getRecipes();
                }
            })
        }
    }

    getRecipes() {
        this.recipeService.getRecipesForUser(this.user.username).subscribe(data => {
            this.recipes = data;
        })
    }

    updateUserSaveList(saveForm: SaveEntityFormModel) {
        console.log(saveForm)
        console.log(this.user)

        if (saveForm.type == "ADD") {
            this.recipeService.addFavorite(saveForm.entityId, this.user.id).subscribe(data =>
                this.refreshFavoriteNames(true)
            );
        }
        else if (saveForm.type == "REMOVE") {
            this.recipeService.removeFavorite(saveForm.entityId, this.user.id).subscribe(data =>
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

    deleteRecipe(recipe) {

    }

    hideCreateRecipeDialog() {
        this.createRecipeDialog = false;
        this.getRecipes();
    }
}
