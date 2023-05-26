import {Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AddIngredientModel} from "../../../../models/addIngredientModel.model";
import {IngredientsByCategoryModel} from "../../../../models/ingredientsByCategory.model";
import {IngredientService} from "../../../../services/ingredient.service";
import {UtilsService} from "../../../../services/utils.service";
import {RecipeService} from "../../../../services/recipe.service";
import {IngredintsDisplayModel} from "../../../../models/ingredintsDisplay.model";
import {RateTypeEnum} from "../../../../enums/rateType.enum";
import * as events from "events";
import {RecipeModel} from "../../../../models/recipe.model";
import {IngredientModel} from "../../../../models/ingredient.model";
import {DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
    selector: 'app-create-recipe',
    templateUrl: './create-recipe.component.html',
    styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit {

    @Input()
    username: string;

    @Input()
    type: string;

    @Input()
    recipe: RecipeModel;

    @Output()
    closeDialog = new EventEmitter<boolean>();

    ingredients: IngredintsDisplayModel[] = new Array<IngredintsDisplayModel>;
    measurements: string[];

    ingredientService: IngredientService;
    recipeService: RecipeService;
    utilsService: UtilsService;

    addedIngredients: AddIngredientModel[] = new Array<AddIngredientModel>;

    recipeName: string = "";
    imageLink: string = "";
    prepareTime: string;
    difficulty: number = 0;
    spiciness: number = 0;
    description: string = "";
    howToPrepare: string = "";
    isVegan: boolean = false;

    keysPressed = {};

    imageComponent: string = "<img src=\"insert-image-source\">";

    rateType = RateTypeEnum;

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

        this.initDialog();

        if (this.type != 'EDIT') {
            this.addIngredient();
        }
    }

    mapIngredientToAddIngredient(ingredients: IngredientModel[]): AddIngredientModel[] {
        let result = new Array<AddIngredientModel>;

        ingredients.forEach(ing => {
            let item = new AddIngredientModel();
            let name = new IngredintsDisplayModel();
            name.name = ing.name;
            item.ingredientName = name;
            item.measurementUnit = ing.measurementUnit;

            result.push(item);
        })

        return result;
    }

    updateDifficultyFilter(rate: number) {
        this.difficulty = rate;
    }

    updateSpicinessFilter(rate: number) {
        this.spiciness = rate;
    }

    resetDifficultyFilter(event: MouseEvent) {
        event.preventDefault();
        this.difficulty = 0;
    }

    resetSpicinessFilter(event: MouseEvent) {
        event.preventDefault();
        this.spiciness = 0;
    }

    // @HostListener('document:keypress', ['$event'])
    // handleKeyboardEvent(event: KeyboardEvent) {
    //     console.log(event.type)
    //     console.log(event.key);
    // }

    clearPressedKeys() {
        this.keysPressed = new Map();
    }

    formatText(event)  {
        let target = event.target || event.srcElement;
        const textArea = document.getElementById(target.id) as HTMLTextAreaElement;
        let startPos = textArea.selectionStart;
        let endPos = textArea.selectionEnd;

        this.keysPressed[event.key] = true;

        if (event.key === "i" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + this.imageComponent;
        }

        if (event.key === "b" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<b>"
                + textArea.value.substring(startPos, endPos) + "</b>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "1" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h1>"
                + textArea.value.substring(startPos, endPos) + "</h1>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "2" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h2>"
                + textArea.value.substring(startPos, endPos) + "</h2>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "3" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h3>"
                + textArea.value.substring(startPos, endPos) + "</h3>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "4" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h4>"
                + textArea.value.substring(startPos, endPos) + "</h4>"
                + textArea.value.substring(endPos, textArea.textLength);
        }

        if (event.key === "5" && this.keysPressed['Control']) {
            textArea.value = textArea.value.substring(0, startPos) + "<h5>"
                + textArea.value.substring(startPos, endPos) + "</h5>"
                + textArea.value.substring(endPos, textArea.textLength);
        }
    }

    createRecipe() {
        let ingredientNames = this.addedIngredients.map(element => element.ingredientName.name);
        let ingredientMeasurement = this.addedIngredients.map(element => element.measurementUnit);

        let recipe = {
            id: null,
            ownerName: this.username,
            name: this.recipeName,
            description: this.description,
            howToPrepare: this.howToPrepare,
            time: this.prepareTime,
            difficulty: this.difficulty,
            spiciness: this.spiciness,
            isVegan: this.isVegan,
            publicRecipe: true,
            imageAddress: this.imageLink,
            ingredientNames: ingredientNames,
            ingredientMeasurements: ingredientMeasurement
        }

        console.log(recipe)

        if (this.recipe != null) {
            recipe.id = this.recipe.id;
        }

        this.recipeService.createNewRecipe(recipe).subscribe(result => {
                this.closeModal();
                this.resetInputs();
            },
            () => console.log("An error has occurred while trying to create a new recipe."));
    }

    private resetInputs() {
        this.description = '';
        this.howToPrepare = '';
        this.prepareTime = '';
        this.difficulty = 0;
        this.imageLink = '';
        this.recipeName = '';
        this.addedIngredients = new Array<AddIngredientModel>;
    }

    addIngredient() {
        let ingredient = new AddIngredientModel();

        this.addedIngredients.push(ingredient);
    }

    deleteIngredient(index: number) {
        this.addedIngredients.splice(index, 1);
    }

    initDialog(): void {
        if (this.type === 'EDIT') {
            this.recipeName = this.recipe.name;
            this.description = this.recipe.description.replaceAll('<br>', '\n');
            this.difficulty = this.recipe.difficulty;
            this.spiciness = this.recipe.spiciness;
            this.prepareTime = this.recipe.time.toString();
            this.isVegan = this.recipe.vegan;
            this.howToPrepare = this.recipe.howToPrepare.replaceAll('<br>', '\n');
            this.imageLink = this.recipe.imageAddress;
            this.addedIngredients = this.mapIngredientToAddIngredient(this.recipe.ingredientList);
        }
    }

    closeModal() {
        this.closeDialog.emit(true);
    }
}
