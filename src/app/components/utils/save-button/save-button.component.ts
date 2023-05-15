import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SaveEntityFormModel} from "../../../models/saveEntityFormModel";
import {BaseEntityModel} from "../../../models/baseEntity.model";

@Component({
  selector: 'save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent {

    @Input()
    entity: BaseEntityModel;

    @Output()
    outRecipe= new EventEmitter<SaveEntityFormModel>();

    emitAddEntity(id: number) {
        let form = new SaveEntityFormModel();
        form.entityId = id;
        form.type = "ADD";

        this.outRecipe.emit(form);
    }

    emitRemoveEntity(id: number) {

        let form = new SaveEntityFormModel();
        form.entityId = id;
        form.type = "REMOVE";

        this.outRecipe.emit(form);
    }
}
