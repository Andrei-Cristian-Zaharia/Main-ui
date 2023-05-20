import {Component, Inject} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {PersonService} from "../../services/person.service";
import {Router} from "@angular/router";
import {MessageService} from 'primeng/api';
import {catchError, throwError} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ApiConfig} from "../../configs/api-config.service";

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

    status: string = null;

    constructor(private authService: AuthService,
                @Inject(ApiConfig) private apiConfig: ApiConfig,
                private router: Router,
                private messageService: MessageService,
                private http: HttpClient,
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
            let body = {
                username: this.username,
                emailAddress: this.emailAddress,
                password: this.password
            }

            this.http.post(this.apiConfig.PERSON_API + "/create", body, this.personService.getOptions()).pipe(
                catchError(error => {
                    this.status = error.status;
                    if (error.status === 409) {
                        this.showAccountAlreadyExistsError();
                    }

                    return throwError(error)
                }))
                .subscribe(data => {
                    this.authService.authLogin(this.emailAddress, this.password);
                });
        } else {
            this.showDifferentPasswordsError();
        }
    }

    login() {
        this.authService.authLogin(this.emailAddress, this.password).then(
            () => console.log("yaya"),
            () => console.log("dd")
        )
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
            detail: 'This email or username has already been used'
        });
    }

    showInvalidAccount() {
        this.messageService.add({
            closable: false,
            severity: 'error',
            summary: 'Error',
            detail: 'Email or password are invalid !'
        });
    }
}
