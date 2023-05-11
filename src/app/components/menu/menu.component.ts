import {Component, Input, OnInit} from '@angular/core';
import {MenuCategorisedModel, MenuCategory, MenuItem} from "../../models/menu.model";
import {MenuService} from "../../services/menu.service";
import {BasicRecipeModel, RecipeModel} from "../../models/recipe.model";
import {Router} from "@angular/router";
import {RecipeService} from "../../services/recipe.service";
import {CookieService} from "ngx-cookie-service";

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
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

    menuName: string;

    currentMenuItems: number[] = new Array<number>();

    categories: MenuCategory[] = new Array<MenuCategory>();

    newCategoryName: string = "";

    selectedCategory: string = "";
    newItemPrice: number;
    newItemName: string = "";
    newItemDescription: string = "";
    newItemRecipe: BasicRecipeModel;
    recipes: RecipeModel[];

    newItemId: number;
    saveEdit: boolean = false;

    constructor(private menuService: MenuService,
                private router: Router,
                private recipeService: RecipeService,
                private cookieService: CookieService) {
    }

    ngOnInit(): void {
        if (this.menuId === undefined) {
            this.createMenu = true;
        } else {
            this.getMenu();
            this.getRecipes();
        }

        console.log(this.menuId)


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

        await this.sleep(1000);

        this.menuService.updateMenuItems(body).subscribe(data => console.log("Menu updated !"));
    }

    getRecipes() {
        this.recipeService.getRecipesForUser(this.cookieService.get('username')).subscribe(data => {
            this.recipes = data;
        })
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

                    let body = {
                        id: itm.id,
                        menuId: this.menu.menuId,
                        price: itm.price,
                        name: itm.recipe != null ? itm.recipe.name : itm.name,
                        description: itm.description,
                        category: categoryName,
                        recipeId: itm.recipe != undefined ? itm.recipe.id : null
                    }

                    this.menuService.createMenuItem(body).subscribe(data => {
                        this.currentMenuItems.push(data.id);
                        console.log(data)
                    });

                    this.init();
                }
            });
        } else {
            this.menu.categories.find(cat => cat.category == categoryName)
                .items.push(new MenuItem(itemId, this.newItemPrice, this.newItemName, this.newItemDescription, this.newItemRecipe));
        }

        console.log(this.menu.categories)
        this.closeCreateItemCategory(categoryName);
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
        this.router.navigateByUrl('recipe?name=' + recipe);
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
                console.log(item.recipe)
                console.log(this.newItemRecipe)
                console.log(this.recipes)

                return true;
            } else {
                return false;
            }
        });

        this.saveEdit = true;
    }

    deleteMenuItem(id: number) {
        this.menuService.deleteMenuItem(id).subscribe();
        this.menu = null;
        this.getMenu();
    }
}
