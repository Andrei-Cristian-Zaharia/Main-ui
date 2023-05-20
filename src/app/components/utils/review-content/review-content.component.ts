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
import {PersonService} from "../../../services/person.service";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {RateTypeEnum} from "../../../enums/rateType.enum";
import {ReviewTypeEnum} from "../../../enums/reviewType.enum";
import {PersonModel} from "../../../models/person.model";
import {AuthService} from "../../../services/auth.service";

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

    @Input()
    reviewType: ReviewTypeEnum;

    @Input()
    owner: PersonModel;

    @Output()
    rating = new EventEmitter<number>();

    currentUser: PersonModel = null;

    reviews: ReviewModel[] = new Array<ReviewModel>;

    userLogged: boolean = false;
    userAlreadyPosted: boolean = false;

    insertNewReviewWindow: boolean = false;
    newReviewPanelOpen: boolean = false;

    givenStars: number = 0;
    title: string;
    content: string;

    rateType = RateTypeEnum;

    oldReview: ReviewModel;

    confirmDeleteDialog: boolean = false;
    currentDeleteReview: ReviewModel;

    isMobile: boolean;
    rateImageSize

    constructor(private responsive: BreakpointObserver,
                private reviewService: ReviewService,
                private cookieService: CookieService,
                private personService: PersonService,
                private authService: AuthService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.responsive.observe(Breakpoints.HandsetPortrait)
            .subscribe(result => {
                this.isMobile = result.matches;
                if (this.isMobile) {
                    this.rateImageSize = 20;
                } else {
                    this.rateImageSize = 25;
                }
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.reviewType === ReviewTypeEnum.VIEW) {
            this.getReviewsForUser();
        }

        if (this.entity != null) {
            this.checkLogin();
            this.refreshReviews();
            this.resetReview();
        }
    }

    checkLogin() {
        if (this.cookieService.check('token')) {
            this.getCurrentUser();
        }
    }

    getCurrentUser() {
        this.authService.getUser(null).subscribe(data => {
            this.currentUser = data
            this.userLogged = true;
            this.checkPostReview();
        });
    }


    createReview() {
        let review = {
            "title": this.title,
            "text": this.content,
            "rating": this.givenStars,
            'category': this.category,
            "ownerEmail": this.currentUser.emailAddress,
            "recipeId": this.entity.id
        }

        this.reviewService.createNewReview(review).subscribe(result => {
            this.refreshReviews();
            this.resetReview();
            this.updateRating();
            this.checkPostReview();
        });
    }

    editReview() {
        let review = {
            "id": this.oldReview.id,
            "title": this.title,
            "text": this.content,
            "rating": this.givenStars,
        }

        this.reviewService.editReview(review).subscribe(result => {
            this.refreshReviews();
            this.resetReview();
            this.updateRating();
            this.checkPostReview();
            this.newReviewPanelOpen = false;
        });
    }

    checkPostReview() {
        this.reviewService.checkReviewFromUserOnEntity(this.currentUser.emailAddress, this.entity.id, this.category)
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
            this.refreshReviews();
            this.resetReview();
        }
    }

    goToProfile(username) {
        this.router.navigateByUrl('profile?name=' + username);
    }

    goToRecipePage(name: string) {
        this.router.navigateByUrl('recipe?name=' + name);
    }

    goToRestaurantPage(name: string) {
        this.router.navigateByUrl('restaurant?name=' + name);
    }

    showDeleteDialog(review: ReviewModel) {
        this.confirmDeleteDialog = true;
        this.currentDeleteReview = review;
    }

    hideDeleteDialog() {
        this.confirmDeleteDialog = false;
    }

    deleteReviewOfUser() {
        this.reviewService.deleteReview(this.currentDeleteReview.id).subscribe();
        const index = this.reviews.indexOf(this.currentDeleteReview);
        if (index !== -1) {
            this.reviews.splice(index, 1);
        }

        this.newReviewPanelOpen = false;
        this.userAlreadyPosted = false;
        this.hideDeleteDialog();
    }

    editReviewOfUser(review: ReviewModel) {
        this.title = review.title;
        this.givenStars = review.rating;
        this.content = review.text;

        const index = this.reviews.indexOf(review);
        if (index !== -1) {
            this.reviews.splice(index, 1);
        }

        this.oldReview = review;

        this.newReviewPanelOpen = true;
        this.insertNewReviewWindow = true;
    }

    getReviewsForUser() {
        this.reviewService.getReviewsForUser(this.owner.emailAddress).subscribe(result => {
            this.reviews = result;
        })
    }
}
