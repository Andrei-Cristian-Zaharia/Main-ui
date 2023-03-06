import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeSummaryComponent } from './recipe-summary.component';

describe('RecipeSummaryComponent', () => {
  let component: RecipeSummaryComponent;
  let fixture: ComponentFixture<RecipeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
