import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsDetailsLandingComponent } from './leads-details-landing.component';

describe('LeadsDetailsLandingComponent', () => {
  let component: LeadsDetailsLandingComponent;
  let fixture: ComponentFixture<LeadsDetailsLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsDetailsLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsDetailsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
