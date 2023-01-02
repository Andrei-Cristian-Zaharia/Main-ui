import {Component, Input, OnInit} from '@angular/core';
import {AddIngredientModel} from "../../../../models/addIngredientModel.model";
import {IngredientsByCategoryModel} from "../../../../models/ingredientsByCategory.model";
import {IngredientService} from "../../../../services/ingredient.service";
import {UtilsService} from "../../../../services/utils.service";
import {RecipeService} from "../../../../services/recipe.service";
import {IngredintsDisplayModel} from "../../../../models/ingredintsDisplay.model";

@Component({
    selector: 'app-create-recipe',
    templateUrl: './create-recipe.component.html',
    styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit {

    @Input()
    username: string;

    ingredients: IngredintsDisplayModel[] = new Array<IngredintsDisplayModel>;
    measurements: string[];

    ingredientService: IngredientService;
    recipeService: RecipeService;
    utilsService: UtilsService;

    addedIngredients: AddIngredientModel[] = new Array<AddIngredientModel>;

    recipeName: string;
    imageLink: string;
    time: number = 1;
    difficulty: number;
    description: string;
    howToPrepare: string;

    constructor(ingredientService: IngredientService,
                utilsService: UtilsService,
                recipeService: RecipeService) {
        this.ingredientService = ingredientService;
        this.recipeService = recipeService;
        this.utilsService = utilsService;
    }

    ngOnInit(): void {
        this.ingredientService.getIngredientsNames().subscribe(data => {
            for (let value of data) {
                this.ingredients.push(
                    {
                        name: value
                    }
                );
            }
            console.log(data);
        })

        this.utilsService.getMeasurements().subscribe(data => {
            this.measurements = data;
            console.log(data);
        })

        this.addIngredient();
    }

    createRecipe() {
        let ingredientNames = this.addedIngredients.map(element => element.ingredientName.name);
        let ingredientQuantity = this.addedIngredients.map(element => element.quantity);
        let ingredientMeasurement = this.addedIngredients.map(element => element.measurementUnit);

        let recipe = {
            ownerName: this.username,
            name: this.recipeName,
            description: this.description,
            howToPrepare: this.howToPrepare,
            time: this.time,
            difficulty: this.difficulty,
            imageAddress: this.imageLink,
            ingredientNames: ingredientNames,
            ingredientQuantities: ingredientQuantity,
            ingredientMeasurements: ingredientMeasurement
        }

        this.recipeService.createNewRecipe(recipe).subscribe(result => console.log(result),
            () => console.log("An error has occurred while trying to create a new recipe."));
    }

    addIngredient() {
        let ingredient = new AddIngredientModel();
        ingredient.quantity = 0;

        this.addedIngredients.push(ingredient);

        console.log(this.addedIngredients)
    }

    deleteIngredient(index: number) {
        this.addedIngredients.splice(index, 1);
    }
}
