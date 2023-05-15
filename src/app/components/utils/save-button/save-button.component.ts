import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SaveEntityFormModel} from "../../../models/saveEntityFormModel";

@Component({
  selector: 'save-button',
  templateUrl: './save-button.component.html',
  styleUrls: ['./save-button.component.scss']
})
export class SaveButtonComponent {

    @Input()
    id: number;

    @Input()
    saved: boolean;

    @Output()
    outResult = new EventEmitter<SaveEntityFormModel>();

    constructor() {
        this.saved = false;
        this.id = 2;
    }

    emitAddEntity() {
        let form = new SaveEntityFormModel();
        form.entityId = this.id;
        form.type = "ADD";

        this.outResult.emit(form);
    }

    emitRemoveEntity() {

        let form = new SaveEntityFormModel();
        form.entityId = this.id;
        form.type = "REMOVE";

        this.outResult.emit(form);
    }
}
