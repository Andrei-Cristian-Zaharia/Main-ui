import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {ReviewModel} from "../../../models/review.model";
import {ReviewService} from "../../../services/review.service";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {BaseEntityModel} from "../../../models/baseEntity.model";
import {EntityTypeEnum} from "../../../enums/entityType.enum";
import {AuthService} from "../../../services/auth.service";
import {PersonService} from "../../../services/person.service";
import {PersonBasicInfoModel} from "../../../models/personBasicInfo.model";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {RateTypeEnum} from "../../../enums/rateType.enum";

@Component({
    selector: 'review-content',
    templateUrl: './review-content.component.html',
    styleUrls: ['./review-content.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ReviewContentComponent implements OnInit, OnChanges {

    @Input()
    entity: BaseEntityModel;

    @Input()
    category: EntityTypeEnum;

    @Output()
    rating = new EventEmitter<number>();

    reviews: ReviewModel[] = new Array<ReviewModel>;

    user: PersonBasicInfoModel;
    userLogged: boolean = false;
    userAlreadyPosted: boolean = false;

    insertNewReviewWindow: boolean = false;
    newReviewPanelOpen: boolean = false;

    givenStars: number = 0;
    title: string;
    content: string;

    rateType = RateTypeEnum;

    confirmDeleteDialog: boolean = false;
    currentDeleteId: number;

    isMobile: boolean;

    constructor(private responsive: BreakpointObserver,
                private reviewService: ReviewService,
                private cookieService: CookieService,
                private personService: PersonService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.responsive.observe(Breakpoints.HandsetPortrait)
            .subscribe(result => {
                this.isMobile = result.matches;
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.entity != null) {
            this.getCurrentUser();
            this.refreshReviews();
            this.checkPostReview();
            this.resetReview();
            this.checkLogin();
        }
    }

    getCurrentUser() {
        this.personService.getPersonDetails(this.cookieService.get("emailAddress")).subscribe(data => {
            this.user = data;
        })
    }

    checkLogin() {
        if (this.cookieService.get('token') != "") {
            this.userLogged = true;
        }
    }

    createReview() {
        let review = {
            "title": this.title,
            "text": this.content,
            "rating": this.givenStars,
            'category': this.category,
            "ownerEmail": this.cookieService.get('emailAddress'),
            "recipeId": this.entity.id
        }

        this.reviewService.createNewReview(review).subscribe(result => {
            this.refreshReviews();
            this.resetReview();
            this.updateRating();
            this.checkPostReview();
        });
    }

    checkPostReview() {
        this.reviewService.checkReviewFromUserOnEntity(this.cookieService.get('emailAddress'), this.entity.id, this.category)
            .subscribe(data => {
                this.userAlreadyPosted = data;
            });
    }

    updateReviewRating(rate: number) {
        this.givenStars = rate;
    }

    resetReviewRating(event: MouseEvent) {
        event.preventDefault();
        this.givenStars = 0;
    }

    updateRating() {
        let sum = 0;

        for (let review of this.reviews) {
            sum += review.rating;
        }

        this.rating.emit(sum / this.reviews.length);
    }

    resetReview() {
        this.insertNewReviewWindow = false;
        this.title = "";
        this.content = "";
        this.givenStars = 0;
    }

    refreshReviews() {
        this.reviewService.getReviewsForEntity(this.entity.id, this.category).subscribe(data => {
            this.reviews = data;
            this.updateRating();
        });
    }

    toggleCreateReviewWindow() {

        if (this.newReviewPanelOpen == false) {
            this.insertNewReviewWindow = true;
            this.newReviewPanelOpen = true;
            setTimeout(() => {
                document.getElementById("newReview").scrollIntoView({behavior: 'smooth'});
            }, 150);
        } else {
            this.insertNewReviewWindow = false;
            this.newReviewPanelOpen = false;
            this.resetReview();
        }
    }

    goToProfile(username) {
        this.router.navigateByUrl('profile?name=' + username);
    }

    showDeleteDialog(id: number) {
        this.confirmDeleteDialog = true;
        this.currentDeleteId = id;
    }

    hideDeleteDialog() {
        this.confirmDeleteDialog = false;
    }

    deleteReviewOfUser() {
        this.reviewService.deleteReview(this.currentDeleteId).subscribe();
        this.hideDeleteDialog();
        location.reload();
    }
}
