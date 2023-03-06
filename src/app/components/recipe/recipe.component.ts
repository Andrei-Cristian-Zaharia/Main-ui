import {Component, OnInit} from '@angular/core';
import {RecipeService} from "../../services/recipe.service";
import {RecipeModel} from "../../models/recipe.model";
import {IngredientService} from "../../services/ingredient.service";
import {BasicIngredientModel} from "../../models/basicIngredient.model";
import {IngredientsByCategoryModel} from "../../models/ingredientsByCategory.model";
import {EntityTypeEnum} from "../../enums/entityType.enum";
import {RateTypeEnum} from "../../enums/rateType.enum";

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
    images: string[] = [];

    searchIngredient: string = "";
    searchCategory: string = "";

    selectedIngredientsDialog: boolean = false;
    selectedIngredientCategoryDialog: boolean = false;
    selectedCategory: string = "";
    chooseIngredients: BasicIngredientModel[] = new Array<BasicIngredientModel>;
    selectedIngredients: BasicIngredientModel[] = new Array<BasicIngredientModel>;
    selectedIngredientsNames: string[] = new Array<string>;

    viewRecipeDialog: boolean;
    selectedRecipe: RecipeModel;

    // search fields
    filterRating: number = 0;
    filterDifficulty: number = 0;
    filterSpiciness: number = 0;
    filterRecipeName: string = null;
    filterAuthorName: string = null;
    rangeValues: number[] = [1, 600];
    sliderText: string = null;

    rateType = RateTypeEnum;

    constructor(recipeService: RecipeService, ingredientService: IngredientService) {
        this.ingredientService = ingredientService;
        this.recipeService = recipeService;
    }

    ngOnInit(): void {
        this.refreshRecipes();
        this.refreshIngredients();
        this.changeSliderValue();
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

    refreshRecipes(): void {
        console.log(this.selectedIngredientsNames);

        let ingredients = this.selectedIngredients.map(i => i.name);

        let filterForm = {
            "recipeName": this.filterRecipeName,
            "prepareTimeMin": this.rangeValues[0],
            "prepareTimeMax": this.rangeValues[1],
            "rating": this.filterRating,
            "difficulty": this.filterDifficulty,
            "spiciness": this.filterSpiciness,
            "ingredientsNames": ingredients
        }

        this.recipeService.getRecipesFilteredByIngredients(filterForm).subscribe(result => {

            this.recipes = result;
            console.log(result)

            this.isLoaded = true;
        })
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

    showViewRecipeDialog(recipe) {
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
}

