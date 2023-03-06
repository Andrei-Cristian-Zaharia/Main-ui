import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PersonService} from "../../services/person.service";
import {AuthService} from "../../services/auth.service";
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

    constructor(private personService: PersonService,
                private cookieService: CookieService,
                private authService: AuthService,
                private router: Router) { }

    user: PersonBasicInfoModel;
    userLogged: boolean;

    createRecipeDialog: boolean = false;

    ngOnInit(): void {
        if (this.cookieService.check('emailAddress')) {
            this.personService.getPersonDetails(this.cookieService.get('emailAddress')).subscribe(data => {
                this.user = data;
                this.userLogged = true;
            }, () => {
                this.userLogged = false;
            });
        }
        else {
            this.userLogged = false;
        }
    }

    goToRecipes(){
        this.router.navigateByUrl('');
    }

    logout(){
        this.authService.authLogout();
    }

    showCreateRecipeDialog() {
        this.createRecipeDialog = true;
    }
}
