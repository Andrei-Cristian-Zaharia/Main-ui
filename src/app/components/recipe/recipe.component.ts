import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {RecipeService} from "../../services/recipe.service";
import {RecipeModel} from "../../models/recipe.model";
import {IngredientService} from "../../services/ingredient.service";
import {BasicIngredientModel} from "../../models/basicIngredient.model";
import {IngredientsByCategoryModel} from "../../models/ingredientsByCategory.model";
import {RateTypeEnum} from "../../enums/rateType.enum";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonService} from "../../services/person.service";
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";
import {CookieService} from "ngx-cookie-service";

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
    isLoaded = false;
    showIngredientList = false;
    private recipeService: RecipeService;
    private ingredientService: IngredientService;
    recipes: RecipeModel[];
    ingredients: IngredientsByCategoryModel;
    filteredIngredients: IngredientsByCategoryModel;

    searchIngredient: string = "";
    searchCategory: string = "";

    selectedIngredientsDialog: boolean = false;
    selectedIngredientCategoryDialog: boolean = false;
    selectedCategory: string = "";
    chooseIngredients: BasicIngredientModel[] = new Array<BasicIngredientModel>;
    selectedIngredients: BasicIngredientModel[] = new Array<BasicIngredientModel>;
    selectedIngredientsNames: string[] = new Array<string>;

    // search fields
    filterRating: number = 0;
    filterDifficulty: number = 0;
    filterSpiciness: number = 0;
    filterRecipeName: string = null;
    filterAuthorName: string = "";
    rangeValues: number[] = [1, 600];
    sliderText: string = null;

    rateType = RateTypeEnum;

    isMobile: boolean;
    ratingImageSize: number;

    user: PersonBasicInfoModel;
    favoriteNames: string[];
    showFavorites: boolean;

    constructor(recipeService: RecipeService, ingredientService: IngredientService,
                private responsive: BreakpointObserver,
                private router: Router,
                private personService: PersonService,
                private activatedRoute: ActivatedRoute,
                private cookieService: CookieService) {
        this.ingredientService = ingredientService;
        this.recipeService = recipeService;
    }

    ngOnInit(): void {
        this.responsive.observe(Breakpoints.HandsetPortrait)
            .subscribe(result => {
                this.isMobile = result.matches;
            });

        this.getCurrentUser();
        this.refreshIngredients();
        this.changeSliderValue();

        if (this.isMobile) {
            this.ratingImageSize = 24;
        } else {
            this.ratingImageSize = 30;
        }
    }

    getCurrentUser() {
        if (this.cookieService.get('emailAddress') != null) {
            this.personService.getPersonDetails(this.cookieService.get('emailAddress')).subscribe(data => {
                this.user = data

                this.refreshFavoriteNames();
            });
        } else {
            this.refreshRecipes();
        }
    }

    updateRatingFilter(rate: number) {
        this.filterRating = rate;

        this.refreshRecipes();
    }

    updateDifficultyFilter(rate: number) {
        this.filterDifficulty = rate;

        this.refreshRecipes();
    }

    updateSpicinessFilter(rate: number) {
        this.filterSpiciness = rate;

        this.refreshRecipes();
    }

    resetRatingFilter(event: MouseEvent) {
        event.preventDefault();
        this.filterRating = 0;

        this.refreshRecipes();
    }

    resetDifficultyFilter(event: MouseEvent) {
        event.preventDefault();
        this.filterDifficulty = 0;

        this.refreshRecipes();
    }

    resetSpicinessFilter(event: MouseEvent) {
        event.preventDefault();
        this.filterSpiciness = 0;

        this.refreshRecipes();
    }

    refreshFavoriteNames() {
        this.recipeService.getFavoriteListNames(this.user.emailAddress).subscribe(data => {
            this.favoriteNames = data
            this.refreshRecipes();
        });
    }

    refreshRecipes(): void {
        this.activatedRoute.queryParamMap.subscribe(params => {

            if (this.user != null && this.activatedRoute.snapshot.queryParams['favorites'] && params.get('favorites') === 'show') {
                this.showFavorites = false;
                this.recipeService.getFavoriteListFiltered(
                    this.user.emailAddress,
                    this.formFilters()
                ).subscribe(data => {
                    this.recipes = data;
                    this.verifyFavorites();
                })
            } else {
                this.showFavorites = true;
                this.getRecipes();
            }
        })
    }

    getRecipes() {
        this.recipeService.getRecipesFilteredByIngredients(this.formFilters()).subscribe(result => {
            this.recipes = result;

            if (this.user != null){
                this.verifyFavorites();
            }
            else {
                this.isLoaded = true;
            }
        })
    }

    formFilters() {
        let ingredients = this.selectedIngredients.map(i => i.name);

        let filterForm = {
            "recipeName": this.filterRecipeName,
            "authorName": this.filterAuthorName,
            "prepareTimeMin": this.rangeValues[0],
            "prepareTimeMax": this.rangeValues[1],
            "rating": this.filterRating,
            "difficulty": this.filterDifficulty,
            "spiciness": this.filterSpiciness,
            "ingredientsNames": ingredients
        }

        return filterForm
    }

    verifyFavorites() {
        if (this.favoriteNames != undefined){
            this.recipes.forEach(recipe => {
                recipe.saved = this.favoriteNames.includes(recipe.name);
                this.isLoaded = true;
            })
        }
    }

    refreshIngredients(): void {
        this.ingredientService.getAllIngredientsByCategoryWithFilter(this.searchIngredient).subscribe(result => {
            this.ingredients = result;
            this.filteredIngredients = result;

            this.filteredIngredients = new IngredientsByCategoryModel();

            if (this.searchCategory != "") {
                for (let category of this.ingredients.categoryIngredients) {
                    if (category.categoryName.includes(this.searchCategory)) {
                        this.filteredIngredients.categoryIngredients.push(category);
                    }
                }
            } else {
                this.filteredIngredients = this.ingredients;
            }
        })
    }

    toggleIngredientSelection(ingredient: BasicIngredientModel): void {

        if (this.selectedIngredients.includes(ingredient)) {
            const indexIngName = this.selectedIngredientsNames.indexOf(ingredient.name, 0);
            const indexIng = this.selectedIngredients.indexOf(ingredient, 0);
            ingredient.selected = false;
            if (indexIng > -1) {
                this.selectedIngredients.splice(indexIng, 1);
                this.selectedIngredientsNames.splice(indexIngName, 1);
            }
        } else {
            this.selectedIngredientsNames.push(ingredient.name);
            this.selectedIngredients.push(ingredient);
            ingredient.selected = true;
        }

        this.refreshRecipes();
    }

    showSelectedIngredientsDialog() {
        this.selectedIngredientsDialog = true;
    }

    showSelectedIngredientCategoryDialog(selectedCategory) {
        this.selectedIngredientCategoryDialog = true;
        this.selectedCategory = selectedCategory;

        this.chooseIngredients = this.ingredients.categoryIngredients.find(c => c.categoryName == selectedCategory).ingredients;
    }

    toggleShowIngredients(): void {
        this.showIngredientList = !this.showIngredientList;
    }

    changeSliderValue() {
        this.sliderText = "";

        if (this.rangeValues[0] > 60) {
            this.sliderText = Math.floor(this.rangeValues[0] / 60).toString() + "h";

            if (this.rangeValues[0] % 60 != 0) {
                this.sliderText += " " + (this.rangeValues[0] % 60).toString() + "min";
            }
        } else {
            this.sliderText = (this.rangeValues[0] % 60).toString() + "min";
        }

        this.sliderText += " - ";

        if (this.rangeValues[1] > 60) {
            this.sliderText += Math.floor(this.rangeValues[1] / 60).toString() + "h";

            if (this.rangeValues[1] % 60 != 0) {
                this.sliderText += " " + (this.rangeValues[1] % 60).toString() + "min";
            }
        } else {
            this.sliderText += (this.rangeValues[1] % 60).toString() + "min";
        }

        this.refreshRecipes();
    }

    goToRecipes() {
        this.router.navigate(['/recipes']);
    }

    goToFavouriteRecipes() {
        this.router.navigate(['/recipes'], { queryParams: {favorites:'show'}});
    }
}

