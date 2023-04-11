import {Component, EventEmitter, Input, Output} from '@angular/core';
import {RecipeModel} from "../../../models/recipe.model";
import {SaveRecipeFormModel} from "../../../models/saveRecipeForm.model";

@Component({
  selector: 'save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent {

    @Input()
    recipe: RecipeModel;

    @Output()
    outRecipe= new EventEmitter<SaveRecipeFormModel>();

    emitAddRecipe(id: number) {
        let form = new SaveRecipeFormModel();
        form.recipeId = id;
        form.type = "ADD";

        this.outRecipe.emit(form);
    }

    emitRemoveRecipe(id: number) {

        let form = new SaveRecipeFormModel();
        form.recipeId = id;
        form.type = "REMOVE";

        this.outRecipe.emit(form);
    }
}
