import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewNewAccountComponent } from './review-new-account.component';

describe('ReviewNewAccountComponent', () => {
  let component: ReviewNewAccountComponent;
  let fixture: ComponentFixture<ReviewNewAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewNewAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewNewAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
