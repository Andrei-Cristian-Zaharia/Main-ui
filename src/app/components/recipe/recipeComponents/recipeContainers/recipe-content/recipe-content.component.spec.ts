import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeContentComponent } from './recipe-content.component';

describe('RecipeContentComponent', () => {
  let component: RecipeContentComponent;
  let fixture: ComponentFixture<RecipeContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
