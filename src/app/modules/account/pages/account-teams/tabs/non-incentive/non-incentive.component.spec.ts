import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonIncentiveComponent } from './non-incentive.component';

describe('NonIncentiveComponent', () => {
  let component: NonIncentiveComponent;
  let fixture: ComponentFixture<NonIncentiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonIncentiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
