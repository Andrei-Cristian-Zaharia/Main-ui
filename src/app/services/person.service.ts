import {Inject, Injectable} from "@angular/core";
import {ApiConfig} from "../configs/api-config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {PersonDetailsModel} from "../models/personDetails.model";
import {PersonBasicInfoModel} from "../models/personBasicInfo.model";
import {catchError, throwError} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PersonService {

    status: string = null;

    constructor(
        @Inject(ApiConfig) private apiConfig: ApiConfig,
        private authService: AuthService,
        private http: HttpClient
    ) {}

    getPersonDetails(email: string) {
        return this.http.get<PersonBasicInfoModel>(
            this.apiConfig.PERSON_API + "/email?emailAddress=" + email, this.getOptionsAuth());
    }

    getPersonDetailsByUsername(username) {
        return this.http.get<PersonDetailsModel>(
            this.apiConfig.PERSON_API + "/details/name?name=" + username,
            this.getOptionsAuth()
        );
    }

    getAllPersons() {
        return this.http.get<PersonBasicInfoModel[]>(this.apiConfig.PERSON_API + "/all", this.getOptionsAuth());
    }

    savePerson(body) {
        return this.http.post<PersonBasicInfoModel>(this.apiConfig.PERSON_API + "/save", body, this.getOptionsAuth());
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
