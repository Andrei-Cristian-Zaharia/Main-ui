import {Component, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PersonService} from "../../services/person.service";
import {PersonDetailsModel} from "../../models/personDetails.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

    user: PersonDetailsModel;

    constructor(private activatedRoute: ActivatedRoute,
                private personService: PersonService) {}

    ngOnInit(): void {
        this.activatedRoute.queryParamMap.subscribe(params => {

            this.personService.getPersonDetailsByUsername(params.get('name')).subscribe(data => {
                this.user = data;
                console.log(data);
            }, () => console.log("There was an error and user with username " + params.get('name') + " couldn't be fetched..."));
        })
    }
}
