import {Component, Input} from '@angular/core';

@Component({
  selector: 'time-display',
  templateUrl: './time-display.component.html',
  styleUrls: ['./time-display.component.scss']
})
export class TimeDisplayComponent {

    @Input()
    value: number;
}
