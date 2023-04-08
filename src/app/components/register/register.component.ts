import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PersonService} from "../../services/person.service";
import {Router} from "@angular/router";
import {MessageService} from 'primeng/api';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    providers: [MessageService]
})
export class RegisterComponent {
    emailAddress: string = '';
    username: string = '';
    password: string = '';
    confirmPassword: string = '';

    constructor(private authService: AuthService,
                private router: Router,
                private messageService: MessageService,
                private personService: PersonService) {
    }

    createAccount() {
        if (this.username === ''
            || this.emailAddress === ''
            || this.password === ''
            || this.confirmPassword === '') {
            this.showEmptyFieldsError();
            return;
        }

        if (this.password === this.confirmPassword) {
            this.personService.createNewUser(this.username, this.emailAddress, this.password);
        } else {
            this.showDifferentPasswordsError();
        }
    }

    login() {
        this.authService.authLogin(this.emailAddress, this.password);
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }

    showDifferentPasswordsError() {
        this.messageService.add({
            closable: false,
            severity: 'error',
            summary: 'Error',
            detail: 'Passwords mush be the same'
        });
    }

    showEmptyFieldsError() {
        this.messageService.add({
            closable: false,
            severity: 'error',
            summary: 'Error',
            detail: 'All fields must be completed'
        });
    }

    showAccountAlreadyExistsError() {
        this.messageService.add({
            closable: false,
            severity: 'error',
            summary: 'Error',
            detail: 'This email has already been used'
        });
    }
}
