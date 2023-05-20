import {Component, Inject, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {PersonService} from "../../services/person.service";
import {AuthService} from "../../services/auth.service";
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {NgxQrcodeStylingComponent, Options} from "ngx-qrcode-styling";
import {ApiConfig} from "../../configs/api-config.service";
import {RestaurantService} from "../../services/restaurant.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarComponent implements OnInit {

    @ViewChild('qrcode', {static: false}) public qrcode!: NgxQrcodeStylingComponent;
    currentURL: string = "";

    public config: Options = {
        width: 130,
        height: 130,
        image: "assets/ZAHA_LOGOGO.png",
        margin: 2,
        dotsOptions: {
            color: "f3b519",
            type: "dots"
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        imageOptions: {
            crossOrigin: "anonymous",
            margin: 0
        }
    };

    constructor(@Inject(ApiConfig) private apiConfig: ApiConfig,
                private responsive: BreakpointObserver,
                private personService: PersonService,
                private cookieService: CookieService,
                private restaurantService: RestaurantService,
                private authService: AuthService,
                private router: Router) {

        router.events.subscribe((val) => {
            this.currentURL = this.apiConfig.HOST_URL + this.router.url;
            if (this.isMobile !== undefined && !this.isMobile) {
                this.updateQR();
            }
        });
    }

    updateQR(): void {
        this.qrcode.update(this.qrcode.config, {
            data: this.currentURL
        }).subscribe((res) => {});
    }

    user: PersonBasicInfoModel;
    userLogged: boolean = false;

    createRecipeDialog: boolean = false;

    isMobile: boolean;

    ngOnInit(): void {
        if (this.cookieService.check('token')) {
            this.authService.getUser(null).subscribe(data => {
                this.user = data;
                this.userLogged = true;
            }, () => this.userLogged = false);
        }

        this.responsive.observe(Breakpoints.HandsetPortrait).subscribe(result => {
            this.isMobile = result.matches;
        });
    }

    goToRecipes() {
        this.router.navigate(['/recipes']);
    }

    goToRestaurants() {
        this.router.navigate(['/restaurants']);
    }

    goToFavouriteRecipes() {
        this.router.navigate(['/recipes'], {queryParams: {favorites: 'show'}});
    }

    goToProfile() {
        this.router.navigate(['/my-profile']);
    }

    goToAdmin() {
        this.router.navigate(['/admin']);
    }

    goToRestaurant() {
        this.restaurantService.getRestaurantForUser(this.user.username).subscribe(data => {
            this.router.navigateByUrl('restaurant?name=' + data.name);
        })
    }

    logout() {
        this.authService.authLogout();
    }

    login() {
        this.authService.authLoginPage();
    }

    showCreateRecipeDialog() {
        this.createRecipeDialog = true;
    }
}
