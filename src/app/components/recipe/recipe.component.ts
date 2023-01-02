import {Component, OnInit} from '@angular/core';
import {RecipeService} from "../../services/recipe.service";
import {RecipeModel} from "../../models/recipe.model";
import {IngredientService} from "../../services/ingredient.service";
import {BasicIngredientModel} from "../../models/basicIngredient.model";
import {IngredientsByCategoryModel} from "../../models/ingredientsByCategory.model";
import {CategoryIngredientModel} from "../../models/categoryIngredient.model";

@Component({
    selector: 'app-recipe',
    templateUrl: './recipe.component.html',
    styleUrls: ['./recipe.component.scss']
})
export class RecipeComponent implements OnInit {
    isLoaded = false;
    showIngredientList = true;
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

    constructor(recipeService: RecipeService, ingredientService: IngredientService) {
        this.ingredientService = ingredientService;
        this.recipeService = recipeService;
    }

    ngOnInit(): void {
        this.refreshRecipes();
        this.refreshIngredients();
    }

    refreshRecipes(): void {
        this.recipeService.getRecipesFilteredByIngredients(this.selectedIngredientsNames).subscribe(result => {

            this.recipes = result;

            this.isLoaded = true;
            console.log(result);
            console.log(this.images);
        })
    }

    refreshIngredients(): void {
        this.ingredientService.getAllIngredientsByCategoryWithFilter(this.searchIngredient).subscribe(result => {
            this.ingredients = result;
            this.filteredIngredients = result;

            this.filteredIngredients = new IngredientsByCategoryModel();
            this.filteredIngredients.categoryIngredients = new Array<CategoryIngredientModel>;

            console.log(this.searchCategory)
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
        console.log(this.selectedIngredients);
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
}

