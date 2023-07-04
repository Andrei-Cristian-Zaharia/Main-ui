import {Component, Input, OnInit} from '@angular/core';
import {MenuCategorisedModel, MenuCategory, MenuItem} from "../../models/menu.model";
import {MenuService} from "../../services/menu.service";
import {BasicRecipeModel, RecipeModel} from "../../models/recipe.model";
import {Router} from "@angular/router";
import {RecipeService} from "../../services/recipe.service";
import {CookieService} from "ngx-cookie-service";
import {MessageService} from "primeng/api";
import {AuthService} from "../../services/auth.service";
import {PersonBasicInfoModel} from "../../models/personBasicInfo.model";

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    providers: [MessageService]
})
export class MenuComponent implements OnInit {

    @Input()
    menuId: number;

    @Input()
    isOwner: boolean;

    @Input()
    restaurantId: number;

    menu: MenuCategorisedModel;
    createMenu: boolean = false;

    newCategoryName: string = "";
    newItemPrice: number;
    newItemName: string = "";
    newItemDescription: string = "";
    newItemRecipe: BasicRecipeModel;
    recipes: RecipeModel[];

    user: PersonBasicInfoModel;

    newItemId: number;
    saveEdit: boolean = false;

    constructor(private menuService: MenuService,
                private authService: AuthService,
                private router: Router,
                private messageService: MessageService,
                private recipeService: RecipeService) {
    }

    ngOnInit(): void {
        if (this.menuId === undefined) {
            this.createMenu = true;
        } else {
            this.getMenu();

            if (this.isOwner){
                this.getCurrentUser();
            }
        }
    }

    createNewMenu() {
        let body = {
            name: "Main menu",
            restaurantId: this.restaurantId
        }

        this.menuService.createMenu(body).subscribe();
    }

    getRecipes() {
        this.recipeService.getRecipesForUser(this.user.username).subscribe(data => {
            this.recipes = data;
        })
    }

    getCurrentUser() {
        this.authService.getUser(null).subscribe(data => {
            this.user = data;
            this.getRecipes();
        });
    }

    createNewCategory() {
        this.menu.categories.push(new MenuCategory(this.newCategoryName));
        this.newCategoryName = "";
    }

    createNewItem(categoryName: string, itemId: number) {

        if (itemId != null) {
            this.menu.categories.find(cat => cat.category == categoryName)
                .items.find(itm => {
                if (itm.id == itemId) {
                    itm.name = this.newItemName;
                    itm.price = this.newItemPrice;
                    itm.description = this.newItemDescription;
                    itm.recipe = this.newItemRecipe;

                    let body = this.createBodyWithItem(itm, categoryName);

                    this.menuService.createMenuItem(body).subscribe(() => { this.getMenu(); this.savedTOS();});
                }
            }).new = false;
        } else {
            let body = this.createBodyWithoutItem(categoryName);

            this.menuService.createMenuItem(body).subscribe(() => { this.getMenu(); this.savedTOS();});
        }

        this.init();
        this.getMenu();
        this.closeCreateItemCategory(categoryName);
    }

    private createBodyWithoutItem(categoryName: string) {
        return {
            menuId: this.menu.menuId,
            price: this.newItemPrice,
            name: this.newItemRecipe != null ? this.newItemRecipe.name : this.newItemName,
            description: this.newItemDescription,
            category: categoryName,
            recipeId: this.newItemRecipe != undefined ? this.newItemRecipe.id : null
        };
    }

    private createBodyWithItem(itm: MenuItem, categoryName: string) {
        return {
            id: itm.id,
            menuId: this.menu.menuId,
            price: itm.price,
            name: itm.recipe != null ? itm.recipe.name : itm.name,
            description: itm.description,
            category: categoryName,
            recipeId: itm.recipe != undefined ? itm.recipe.id : null
        };
    }

    init() {
        this.newItemId = null;
        this.newItemPrice = null;
        this.newItemName = "";
        this.newItemDescription = "";
        this.newItemRecipe = null;
    }

    openCreateItemCategory(categoryName: string) {
        this.menu.categories.forEach(cat => cat.createItem = false);
        this.menu.categories.find(cat => cat.category == categoryName).createItem = true;
        this.init();
        this.scrollToItemPanel(categoryName);
        this.saveEdit = false;
    }

    closeCreateItemCategory(categoryName: string) {
        this.menu.categories.find(cat => cat.category == categoryName).createItem = false;
        this.init();
    }

    getMenu() {
        this.menuService.getCategorisedMenu(this.menuId).subscribe(data => {
            this.menu = data;
            this.menu.categories.forEach(cat => cat.createItem = false);

            console.log("Menu", this.menu)
        })
    }

    goToRecipe(recipe: string) {
        this.router.navigateByUrl('recipe?name=' + recipe).then(() => console.log("Done"));
    }

    openEditItem(item: MenuItem, categoryName: string) {
        this.menu.categories.forEach(cat => cat.createItem = false);
        this.menu.categories.find(cat => cat.category == categoryName).createItem = true;
        this.menu.categories.find(cat => cat.category == categoryName).items.find(it => {
            if (it.id == item.id) {
                it.name = item.name;
                it.price = item.price;
                it.description = item.description
                it.recipe = item.recipe;

                this.newItemId = item.id;
                this.newItemPrice = item.price;
                this.newItemDescription = item.description;
                this.newItemName = item.name;

                if (item.recipe != null) {
                    this.newItemRecipe = this.recipes.find(r => r.id === item.recipe.id);
                }
                else {
                    this.newItemRecipe = null;
                }

                this.scrollToItemPanel(categoryName);
                return true;
            } else {
                return false;
            }
        }).new = false;

        this.saveEdit = true;
    }

    private scrollToItemPanel(categoryName: string) {
        setTimeout(() => {
            document.getElementById(categoryName + "ItemId").scrollIntoView({block: 'end', behavior: "smooth"});
        }, 150);
    }

    deleteMenuItem(id: number) {
        this.menuService.deleteMenuItem(id).subscribe(() => {
        }, () => {
            this.menu = null;
            this.getMenu();
            this.deleteTOS();
        });
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
}
