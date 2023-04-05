import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PersonService} from "../../services/person.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

    emailAddress: string;
    password: string;

    constructor(private authService: AuthService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.logout();
    }

    login() {
        this.authService.authLogin(this.emailAddress, this.password);
    }

    logout() {
        this.authService.authLogout();
    }

    registerAccount() {
        this.router.navigate(['/register']);
    }
}
