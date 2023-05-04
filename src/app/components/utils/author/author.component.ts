import {Component, Input} from '@angular/core';
import {PersonModel} from "../../../models/person.model";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent {

    @Input()
    person: PersonModel;

    constructor(private router: Router, private cookieService: CookieService) {}

    goToProfile() {
        if (this.person.username != null && this.cookieService.get('username') === this.person.username) {
            this.router.navigateByUrl('my-profile');
            return;
        }

        this.router.navigateByUrl('profile?name=' + this.person.username);
    }
}
