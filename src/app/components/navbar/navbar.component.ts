import {Component, OnInit} from '@angular/core';
import {PersonService} from "../../services/person.service";
import {PersonDetailsModel} from "../../models/personDetails.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

    constructor(private personService: PersonService,
                private authService: AuthService) { }

    user: PersonDetailsModel;

    createRecipeDialog: boolean = false;

    ngOnInit(): void {
        this.personService.getPersonDetails().subscribe(data => this.user = data);
    }

    logout(){
        this.authService.authLogout();
    }

    showCreateRecipeDialog() {
        this.createRecipeDialog = true;
    }
}
