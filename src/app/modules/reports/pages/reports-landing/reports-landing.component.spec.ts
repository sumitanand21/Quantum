import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsLandingComponent } from './reports-landing.component';

describe('ReportsLandingComponent', () => {
  let component: ReportsLandingComponent;
  let fixture: ComponentFixture<ReportsLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
