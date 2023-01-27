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
        TimeTransform
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
        TooltipModule
    ],
    providers: [
        LoginGuard,
        ApiConfig
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}
