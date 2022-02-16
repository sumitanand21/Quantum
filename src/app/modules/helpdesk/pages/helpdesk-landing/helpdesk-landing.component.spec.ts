import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskLandingComponent } from './helpdesk-landing.component';

describe('HelpdeskLandingComponent', () => {
  let component: HelpdeskLandingComponent;
  let fixture: ComponentFixture<HelpdeskLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
