import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'time'})
export class TimeTransform implements PipeTransform {

    newValue: number;

    transform(value: string): string {
        this.newValue = Number(value);
        let result = "";

        if (this.newValue >= 60) {
            result = Math.floor(this.newValue / 60).toString() + "h";

            if (this.newValue % 60 != 0) {
                result += " " + (this.newValue % 60).toString() + "min";
            }
        }
        else {
            result = (this.newValue % 60).toString() + "min";
        }

        return result;
    }
}
