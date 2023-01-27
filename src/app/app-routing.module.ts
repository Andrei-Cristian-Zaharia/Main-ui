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

const routes: Routes = [
    { path: '',  redirectTo: '/recipes', pathMatch: 'full' },
    {
        path: '', component: OverviewComponent, children: [
            // {path: 'recipes', component: RecipeComponent, canActivate: [LoginGuard] },
            {path: 'recipes', component: RecipeComponent },
        ]
    },
    {path: 'login', component: LoginComponent},
    {path: '**', component: NotFoundComponent},  // Wildcard route for a 404 page
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
