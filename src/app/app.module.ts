import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule, LoginGuard} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {RecipeComponent} from './components/recipe/recipe.component';
import {OverviewComponent} from './components/overview/overview.component';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {FlexLayoutModule} from "@angular/flex-layout";
import {FormsModule} from '@angular/forms';
import {RatingModule} from "primeng/rating";
import {HttpClientModule} from '@angular/common/http';
import {GalleriaModule} from 'primeng/galleria';
import {DialogModule} from 'primeng/dialog';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CreateRecipeComponent} from './components/recipe/recipeComponents/create-recipe/create-recipe.component';
import {DropdownModule} from 'primeng/dropdown';
import {InputNumberModule} from 'primeng/inputnumber';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {InputTextModule} from 'primeng/inputtext';
import {LoginComponent} from './components/login/login.component';
import {NotFoundComponent} from './components/not-found/not-found.component';
import {ApiConfig} from "./configs/api-config.service";
import {OverlayPanelModule} from 'primeng/overlaypanel';
import {SliderModule} from 'primeng/slider';
import {RecipeViewComponent} from './components/recipe/recipeComponents/recipe-view/recipe-view.component';
import {TimeTransform} from "./pipes/time.pipe";
import {TooltipModule} from 'primeng/tooltip';
import { ProfileComponent } from './components/profile/profile.component';
import { RecipePageComponent } from './components/recipe/recipeComponents/recipe-page/recipe-page.component';
import {DataViewModule} from "primeng/dataview";
import { RateComponent } from './components/utils/rate/rate.component';
import {SplitterModule} from "primeng/splitter";
import { RestaurantComponent } from './components/restaurant/restaurant.component';
import { RecipeDescriptionComponent } from './components/recipe/recipeComponents/recipeContainers/recipe-description/recipe-description.component';
import { RecipeSummaryComponent } from './components/recipe/recipeComponents/recipeContainers/recipe-summary/recipe-summary.component';
import { RecipeContentComponent } from './components/recipe/recipeComponents/recipeContainers/recipe-content/recipe-content.component';
import { ReviewContentComponent } from './components/utils/review-content/review-content.component';
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";
import {NgxQrcodeStylingModule} from "ngx-qrcode-styling";
import {PasswordModule} from "primeng/password";
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { RecipesListComponent } from './components/utils/recipes-list/recipes-list.component';
import { RegisterComponent } from './components/register/register.component';
import { ToastModule } from 'primeng/toast';
import {InputSwitchModule} from "primeng/inputswitch";
import { ProfileRecipesComponent } from './components/utils/profile-recipes/profile-recipes.component';
import { TimeDisplayComponent } from './components/utils/time-display/time-display.component';
import { SaveButtonComponent } from './components/utils/save-button/save-button.component';
import { ProfileRestaurantComponent } from './components/utils/profile-restaurant/profile-restaurant.component';
import { AuthorComponent } from './components/utils/author/author.component';
import { CreateMenuComponent } from './components/utils/create-menu/create-menu.component';
import { MenuComponent } from './components/menu/menu.component';
import { RestaurantsComponent } from './components/restaurants/restaurants.component';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        RecipeComponent,
        OverviewComponent,
        CreateRecipeComponent,
        LoginComponent,
        NotFoundComponent,
        RecipeViewComponent,
        TimeTransform,
        ProfileComponent,
        RecipePageComponent,
        RateComponent,
        RestaurantComponent,
        RecipeDescriptionComponent,
        RecipeSummaryComponent,
        RecipeContentComponent,
        ReviewContentComponent,
        MyProfileComponent,
        RecipesListComponent,
        RegisterComponent,
        ProfileRecipesComponent,
        TimeDisplayComponent,
        SaveButtonComponent,
        ProfileRestaurantComponent,
        AuthorComponent,
        CreateMenuComponent,
        MenuComponent,
        RestaurantsComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ButtonModule,
        CardModule,
        FlexLayoutModule,
        RatingModule,
        FormsModule,
        GalleriaModule,
        DialogModule,
        DropdownModule,
        InputNumberModule,
        InputTextareaModule,
        OverlayPanelModule,
        InputTextModule,
        SliderModule,
        TooltipModule,
        DataViewModule,
        SplitterModule,
        NgxQRCodeModule,
        NgxQrcodeStylingModule,
        PasswordModule,
        ToastModule,
        InputSwitchModule
    ],
    providers: [
        LoginGuard,
        ApiConfig
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
