import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsLandingComponent } from './deals-landing.component';

describe('DealsLandingComponent', () => {
  let component: DealsLandingComponent;
  let fixture: ComponentFixture<DealsLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
