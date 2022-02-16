import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLandingComponent } from './order-landing.component';

describe('OrderLandingComponent', () => {
  let component: OrderLandingComponent;
  let fixture: ComponentFixture<OrderLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
