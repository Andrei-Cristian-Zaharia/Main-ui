import {Component} from '@angular/core';
import {PersonService} from "../../services/person.service";
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";
import {RecipeService} from "../../services/recipe.service";
import {RecipeModel} from "../../models/recipe.model";
import {RestaurantService} from "../../services/restaurant.service";
import {RestaurantModel} from "../../models/restaurant.model";
import {MessageService} from "primeng/api";

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
    providers: [MessageService]
})
export class AdminPageComponent {

    users: PersonBasicInfoModel[] = new Array<PersonBasicInfoModel>();
    restaurants: RestaurantModel[] = new Array<RestaurantModel>();
    recipes: RecipeModel[] = new Array<RecipeModel>();

    accountTypes: string[] = new Array<string>("REGULAR_USER", "ADMIN");
    statuses: boolean[] = new Array<boolean>(true, false);
    restaurantStatuses: any[];
    recipesStatuses: any[];

    viewRecipeDialog: boolean = false;
    viewRestaurantDialog: boolean = false;

    selectedRecipe: RecipeModel = null;
    selectedRestaurant: RestaurantModel = null;

    constructor(private personService: PersonService,
                private recipeService: RecipeService,
                private messageService: MessageService,
                private restaurantService: RestaurantService) {
        this.getAllRestaurants();
        this.getAllRecipes();
        this.getAllUsers();

        this.recipesStatuses = [
            {label: 'APPROVED', value: 'APPROVED'},
            {label: 'DENIED', value: 'DENIED'},
            {label: 'WAITING', value: 'WAITING'}
        ];

        this.restaurantStatuses = [
            {label: 'ACTIVE', value: 'ACTIVE'},
            {label: 'INACTIVE', value: 'INACTIVE'},
            {label: 'WAITING', value: 'WAITING'}
        ];
    }

    getAllUsers() {
        this.personService.getAllPersons().subscribe(data => {
            this.users = data
        });
    }

    getAllRecipes() {
        this.recipeService.getAllPossibleRecipes().subscribe(data => {
            this.recipes = data;
        })
    }

    getAllRestaurants() {
        this.restaurantService.getRestaurants().subscribe(data => this.restaurants = data);
    }

    saveUser(user: PersonBasicInfoModel) {
        let body = {
            "id": user.id,
            "username": user.username,
            "emailAddress": user.emailAddress,
            "accountType": user.accountType
        }

        this.personService.savePerson(body).subscribe(
            data => this.savedTOS(), () => this.errorTOS("saved")
        );
    }

    saveRestaurant(restaurant: RestaurantModel) {
        let body = {
            "id": restaurant.id,
            "status": restaurant.status,
            "name": restaurant.name,
            "emailAddress": restaurant.emailAddress,
            "telephone": restaurant.telephone
        }

        this.restaurantService.saveRestaurant(body).subscribe(
            data => this.savedTOS(), () => this.errorTOS("saved")
        );
    }

    saveRecipe(recipe: RecipeModel) {
        let body = {
            "id": recipe.id,
            "status": recipe.status
        }

        this.recipeService.saveRecipe(body).subscribe(
            data => this.savedTOS(), () => this.errorTOS("saved")
        );
    }

    getRecipeStatus(status) {
        switch (status) {
            case 'DENIED':
                return 'DENIED';

            case 'APPROVED':
                return 'APPROVED';

            case 'WAITING':
                return 'WAITING';
        }

        return "Nothing";
    }

    getRestaurantStatus(status) {
        switch (status) {
            case 'INACTIVE':
                return 'INACTIVE';

            case 'ACTIVE':
                return 'ACTIVE';

            case 'WAITING':
                return 'WAITING';
        }

        return "Nothing";
    }

    changeRecipeStatus(recipe: RecipeModel) {
        if (recipe.status == "APPROVED") {
            recipe.status = "DENIED";
        } else if (recipe.status == "DENIED") {
            recipe.status = "WAITING";
        } else {
            recipe.status = "APPROVED";
        }
    }

    changeRestaurantStatus(restaurant: RestaurantModel) {
        if (restaurant.status == "ACTIVE") {
            restaurant.status = "INACTIVE";
        } else if (restaurant.status == "INACTIVE") {
            restaurant.status = "WAITING";
        } else {
            restaurant.status = "ACTIVE";
        }
    }

    savedTOS() {
        this.messageService.add({
            closable: false,
            severity: 'success',
            summary: 'Saved !',
            detail: 'Item saved'
        });
    }

    deleteTOS() {
        this.messageService.add({
            closable: false,
            severity: 'success',
            summary: 'Deleted !',
            detail: 'Item deleted'
        });
    }

    errorTOS(action: string) {
        this.messageService.add({
            closable: false,
            severity: 'error',
            summary: 'Error',
            detail: "Item couldn't be " + action + "!"
        });
    }

    selectRecipe(recipe: RecipeModel) {
        this.selectedRecipe = recipe;
        this.viewRecipeDialog = true;
    }

    selectRestaurant(restaurant: RestaurantModel) {
        this.selectedRestaurant = restaurant;
        this.viewRestaurantDialog = true;
    }

    deleteUser(user) {

    }

    deleteRecipe(recipe) {
        this.recipeService.deleteRecipe(recipe.id).subscribe(
            data => this.deleteTOS(), () => this.errorTOS("deleted")
        );
    }

    deleteRestaurant(restaurant) {

    }
}
