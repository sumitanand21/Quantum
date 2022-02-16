import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsLandingComponent } from './leads-landing.component';

describe('LeadsLandingComponent', () => {
  let component: LeadsLandingComponent;
  let fixture: ComponentFixture<LeadsLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
