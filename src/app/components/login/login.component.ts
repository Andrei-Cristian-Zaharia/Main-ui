import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PersonService} from "../../services/person.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    emailAddress: string;
    username: string;
    password: string;
    confirmPassword: string;

    constructor(private authService: AuthService,
                private personService: PersonService) {
    }

    ngOnInit(): void {
        this.logout();
    }

    createAccount() {

        if (this.password === this.confirmPassword) {
            this.personService.createNewUser(this.username, this.emailAddress, this.password);
        }
    }

    login() {
        this.authService.authLogin(this.emailAddress, this.password);
    }

    logout() {
        this.authService.authLogout();
    }
}
