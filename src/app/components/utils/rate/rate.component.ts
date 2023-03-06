import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RateTypeEnum} from "../../../enums/rateType.enum";

@Component({
  selector: 'rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit{

    @Input()
    value: number;

    @Input()
    type: RateTypeEnum;

    @Input()
    readonly: boolean = true;

    @Input()
    imageSize: number = 30;

    @Output()
    selectedValue = new EventEmitter<number>();

    imageSourceFilled: string;
    imageSourceUnfilled: string;
    imageSizePx: string;

    tooltipDescription: string;

    ngOnInit(): void {
        this.imageSizePx = this.imageSize + 'px';

        switch (this.type) {
            case RateTypeEnum.rating:
                this.imageSourceFilled = "assets/star.png"
                this.imageSourceUnfilled = "assets/star-unfilled.png"
                this.tooltipDescription = "Rating"
                break;
            case RateTypeEnum.difficulty:
                this.imageSourceFilled = "assets/effort.png"
                this.imageSourceUnfilled = "assets/effort-unfilled.png"
                this.tooltipDescription = "Difficulty"
                break;
            case RateTypeEnum.spiciness:
                this.imageSourceFilled = "assets/chili.png"
                this.imageSourceUnfilled = "assets/chili-unfilled.png"
                this.tooltipDescription = "Spiciness"
                break;
        }
    }

    emitValue() {
        if (!this.readonly) {
            this.selectedValue.emit(this.value);
        }
    }
}
