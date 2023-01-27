import {Component, HostListener, Input, OnInit} from '@angular/core';
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
    difficulty: number = 2;
    description: string;
    howToPrepare: string;

    keysPressed = {};

    imageComponent: string = "<img src=\"insert-image-source\">";

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
        })

        this.utilsService.getMeasurements().subscribe(data => {
            this.measurements = data;
        })

        this.addIngredient();
    }

    // @HostListener('document:keypress', ['$event'])
    // handleKeyboardEvent(event: KeyboardEvent) {
    //     console.log(event.type)
    //     console.log(event.key);
    // }

    clearPressedKeys() {
        this.keysPressed = new Map();
        console.log(this.keysPressed)
    }

    formatText(event) {
        let target = event.target || event.srcElement;
        const textArea = document.getElementById(target.id) as HTMLTextAreaElement;
        let startPos = textArea.selectionStart;
        let endPos = textArea.selectionEnd;

        this.keysPressed[event.key] = true;
        console.log(textArea.value);

        if (event.key === "i" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + this.imageComponent;
            console.log(textArea.value);
        }

        if (event.key === "b" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<b>"
                + textArea.value.substring(startPos, endPos) + "</b>"
                + textArea.value.substring(endPos, textArea.textLength);
            console.log(textArea.value);
        }

        if (event.key === "1" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h1>"
                + textArea.value.substring(startPos, endPos) + "</h1>"
                + textArea.value.substring(endPos, textArea.textLength);
            console.log(textArea.value);
        }

        if (event.key === "2" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h2>"
                + textArea.value.substring(startPos, endPos) + "</h2>"
                + textArea.value.substring(endPos, textArea.textLength);
            console.log(textArea.value);
        }

        if (event.key === "3" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h3>"
                + textArea.value.substring(startPos, endPos) + "</h3>"
                + textArea.value.substring(endPos, textArea.textLength);
            console.log(textArea.value);
        }

        if (event.key === "4" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h4>"
                + textArea.value.substring(startPos, endPos) + "</h4>"
                + textArea.value.substring(endPos, textArea.textLength);
            console.log(textArea.value);
        }

        if (event.key === "5" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h5>"
                + textArea.value.substring(startPos, endPos) + "</h5>"
                + textArea.value.substring(endPos, textArea.textLength);
            console.log(textArea.value);
        }
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

        this.resetInputs();

        console.log(this.description);

        this.recipeService.createNewRecipe(recipe).subscribe(result => console.log(result),
            () => console.log("An error has occurred while trying to create a new recipe."));
    }

    private resetInputs() {
        this.description = '';
        this.howToPrepare = '';
        this.time = 1;
        this.difficulty = 0;
        this.imageLink = '';
        this.recipeName = '';
        this.addedIngredients = new Array<AddIngredientModel>;
    }

    addIngredient() {
        let ingredient = new AddIngredientModel();
        ingredient.quantity = 0;

        this.addedIngredients.push(ingredient);
    }

    deleteIngredient(index: number) {
        this.addedIngredients.splice(index, 1);
    }
}
