import {Inject, Injectable} from "@angular/core";
import {ApiConfig} from "../configs/api-config.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {MenuCategorisedModel, MenuItem, MenuModel} from "../models/menu.model";

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    constructor(
        @Inject(ApiConfig) private apiConfig: ApiConfig,
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getCategorisedMenu(id: number) {
        return this.http.get<MenuCategorisedModel>(this.apiConfig.MENU + "/getCategorised?id=" + id)
    }

    createMenu(body) {
        return this.http.post(this.apiConfig.MENU + '/create', body, this.getOptions())
    }

    createMenuItem(body) {
        return this.http.post<MenuItem>(this.apiConfig.MENU + '/addItem', body, this.getOptions())
    }

    updateMenuItems(body) {
        return this.http.post(this.apiConfig.MENU + '/updateItems', body, this.getOptions())
    }

    deleteMenuItem(id: number) {
        return this.http.delete(this.apiConfig.MENU_ITEM + "/delete?id=" + id, this.getOptions());
    }

    getOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: this.authService.getToken()
            })
        };
    }
}
