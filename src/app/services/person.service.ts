import {Inject, Injectable} from "@angular/core";
import {ApiConfig} from "../configs/api-config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {AuthService} from "./auth.service";
import {PersonDetailsModel} from "../models/personDetails.model";

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    constructor(
        @Inject(ApiConfig) private apiConfig: ApiConfig,
        private authService: AuthService,
        private http: HttpClient,
        private cookieService: CookieService
    ) { }

    createNewUser(username: string, emailAddress: string, password: string) {

        let body = {
            username: username,
            emailAddress: emailAddress,
            password: password
        }

        this.http.post(this.apiConfig.PERSON_API + "/create", body, this.getOptions())
            .subscribe(data => {
                this.authService.authLogin(emailAddress, password);
            });
    }

    getPersonDetails() {
        return this.http.get<PersonDetailsModel>(
            this.apiConfig.PERSON_API + "/email?emailAddress=" + this.cookieService.get('emailAddress'),
            this.getOptionsAuth()
        );
    }

    getOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            responseType: 'text' as 'json'
        };
    }

    getOptionsAuth() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: this.authService.getToken()
            })
        };
    }
}
