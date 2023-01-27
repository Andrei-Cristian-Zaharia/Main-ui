import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'time'})
export class TimeTransform implements PipeTransform {
    transform(value: number): string {
        let result = "";

        if (value >= 60) {
            result = Math.floor(value / 60).toString() + "h";

            if (value % 60 != 0) {
                result += " " + (value % 60).toString() + "min";
            }
        }
        else {
            result = (value % 60).toString() + "min";
        }

        return result;
    }
}
