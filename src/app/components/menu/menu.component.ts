import {Component, Input, OnInit} from '@angular/core';
import {MenuCategorisedModel, MenuCategory, MenuItem} from "../../models/menu.model";
import {MenuService} from "../../services/menu.service";
import {RecipeModel} from "../../models/recipe.model";
import {patchTsGetExpandoInitializer} from "@angular/compiler-cli/ngcc/src/packages/patch_ts_expando_initializer";
import {delay} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit{

    @Input()
    menu: MenuCategorisedModel;

    @Input()
    isOwner: boolean;

    @Input()
    restaurantId: number;

    createMenu: boolean = false;

    menuName: string;

    currentMenuItems: number[] = new Array<number>();

    categories: MenuCategory[] = new Array<MenuCategory>();

    newCategoryName: string = "";

    selectedCategory: string = "";
    newItemPrice: number;
    newItemName: string = "";
    newItemDescription: string = "";
    newItemRecipe: RecipeModel;

    newItemId: number;

    constructor(private menuService: MenuService, private router: Router) {}

    ngOnInit(): void {
        if (this.menu === undefined) {
            this.createMenu = true;
        } else {
            this.menu.categories.forEach(cat => cat.createItem = false);
        }
    }

    createNewMenu() {
        let body = {
            name: "Main menu",
            restaurantId: this.restaurantId
        }

        this.menuService.createMenu(body).subscribe();
    }

    sleep = (ms) => new Promise(r => setTimeout(r, ms));

    async updateMenuItems() {
        this.menu.categories.forEach(cat => {
            cat.items.forEach(item => {
                if (item.new === true) {
                    let body = {
                        menuId: this.menu.menuId,
                        price: item.price,
                        name: item.recipe != null ? item.recipe.name : item.name,
                        description: item.description,
                        category: cat.category,
                        recipeId: item.recipe != undefined ? item.recipe.id : null
                    }

                    this.menuService.createMenuItem(body).subscribe(data => {
                        this.currentMenuItems.push(data.id);
                        item.new = false;
                    });
                } else {
                    this.currentMenuItems.push(item.id);
                }
            })
        })

        let body = {
            "menuId": this.menu.menuId,
            "itemsList": this.currentMenuItems
        }

        await this.sleep(2000);
        console.log("body", body)

        this.menuService.updateMenuItems(body).subscribe(data => console.log("Menu updated !"));
    }

    createNewCategory() {
        this.menu.categories.push(new MenuCategory(this.newCategoryName));
        this.newCategoryName = "";
    }

    createNewItem(categoryName: string) {
        this.menu.categories.find(cat => cat.category == categoryName)
            .items.push(new MenuItem(this.newItemPrice, this.newItemName, this.newItemDescription, this.newItemRecipe));

        this.newItemPrice = null;
        this.newItemName = "";
        this.newItemDescription = "";
        this.newItemRecipe = null;

        this.closeCreateItemCategory(categoryName);
    }

    openCreateItemCategory(categoryName: string) {
        this.menu.categories.forEach(cat => cat.createItem = false);
        this.menu.categories.find(cat => cat.category == categoryName).createItem = true;
    }

    closeCreateItemCategory(categoryName: string) {
        this.menu.categories.find(cat => cat.category == categoryName).createItem = false;
    }

    goToRecipe(recipe: string) {
        this.router.navigateByUrl('recipe?name=' + recipe);
    }
}
