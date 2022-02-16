import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsListingLandingComponent } from './reports-listing-landing.component';

describe('ReportsListingLandingComponent', () => {
  let component: ReportsListingLandingComponent;
  let fixture: ComponentFixture<ReportsListingLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsListingLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsListingLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
