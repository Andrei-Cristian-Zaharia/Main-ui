import {Inject, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {ApiConfig} from "../configs/api-config.service";
import {Router} from "@angular/router";
import {PersonBasicInfoModel} from "../models/personBasicInfo.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    result: boolean;

    constructor(
        @Inject(ApiConfig) private apiConfig: ApiConfig,
        private http: HttpClient,
        private router: Router,
        private cookieService: CookieService
    ) {
    }

    async authLogin(emailAddress, password) {

        let body = {
            emailAddress: emailAddress,
            password: password
        }

        return await this.http.post<string>(this.apiConfig.AUTH_API + "/login", body, this.getOptions())
            .toPromise().then(token => {
                this.getPersonDetails(emailAddress, token).subscribe(data => {
                    this.cookieService.set('token', token);
                    this.cookieService.set('username', data.username)
                    this.cookieService.set('emailAddress', data.emailAddress);
                    this.router.navigate(['']);
                })
            });
    }

    getOptionsAuth(token: string) {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: token
            })
        };
    }

    getPersonDetails(email: string, token: string) {
        return this.http.get<PersonBasicInfoModel>(
            this.apiConfig.PERSON_API + "/email?emailAddress=" + email, this.getOptionsAuth(token));
    }

    async checkSession(): Promise<boolean> {

        if (this.cookieService.check('token')) {
            await this.http.post<boolean>(
                this.apiConfig.AUTH_API + "/test",
                this.cookieService.get('token'),
                this.getOptions()
            ).toPromise()
                .then(res => {
                    this.result = res;
                });
        } else {
            return false;
        }

        return this.result;
    }

    getOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            responseType: 'text' as 'json'
        };
    }

    authLogout() {
        this.cookieService.delete('token');
        this.cookieService.delete('emailAddress');
        this.router.navigate(['login']);
    }

    authLoginPage() {
        this.router.navigate(['login']);
    }

    getToken(): string {
        return this.cookieService.get('token');
    }

    getCurrentUserEmail(): string {
        return this.cookieService.get('emailAddress');
    }
}
