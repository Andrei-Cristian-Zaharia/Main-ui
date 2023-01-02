import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiConfig} from "../configs/api-config.service";

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor(
        @Inject(ApiConfig) private apiConfig: ApiConfig,

        private http: HttpClient
    ) { }

    getMeasurements() {
        return this.http.get<string[]>(this.apiConfig.UTILS_API + "measurements");
    }
}
