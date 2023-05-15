import {Injectable, NgModule} from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterModule,
    RouterStateSnapshot,
    Routes,
    UrlTree
} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RecipeComponent} from "./components/recipe/recipe.component";
import {NotFoundComponent} from "./components/not-found/not-found.component";
import {Observable} from "rxjs";
import {AuthService} from "./services/auth.service";
import {OverviewComponent} from "./components/overview/overview.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {RecipePageComponent} from "./components/recipe/recipeComponents/recipe-page/recipe-page.component";
import {RestaurantComponent} from "./components/restaurant/restaurant.component";
import {RegisterComponent} from "./components/register/register.component";
import {MyProfileComponent} from "./components/my-profile/my-profile.component";
import {RestaurantsComponent} from "./components/restaurants/restaurants.component";
import {AdminPageComponent} from "./components/admin-page/admin-page.component";

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.authService.checkSession().then(session => {
            if (!session) {
                this.router.navigate(['login']);
            }

            return session;
        });
    }
}

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private authService: AuthService,
                private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.authService.checkAdmin().then(session => {
            if (!session) {
                this.router.navigate(['login']);
            }

            return session;
        });
    }
}

const routes: Routes = [
    {path: '', redirectTo: '/recipes', pathMatch: 'full'},
    {
        path: '', component: OverviewComponent, children: [
            {path: 'recipes', component: RecipeComponent},
            {path: 'restaurants', component: RestaurantsComponent},
            {path: 'restaurants/:favorites', component: RestaurantsComponent},
            {path: 'recipes/:favorites', component: RecipeComponent},
            {path: 'recipe', component: RecipePageComponent},
            {path: 'recipe/:name', component: RecipePageComponent},
            {path: 'profile', component: ProfileComponent},
            {path: 'profile/:username', component: ProfileComponent},
            {path: 'restaurant', component: RestaurantComponent},
            {path: 'restaurant/:name', component: RestaurantComponent},
            {path: 'admin', component: AdminPageComponent, canActivate: [AdminGuard]},
            {path: 'my-profile', component: MyProfileComponent, canActivate: [LoginGuard]}
        ]
    },
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: '**', component: NotFoundComponent},  // Wildcard route for a 404 page
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
