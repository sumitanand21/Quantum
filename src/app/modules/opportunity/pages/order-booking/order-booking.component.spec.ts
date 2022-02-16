import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBookingComponent } from './order-booking.component';

describe('OrderBookingComponent', () => {
  let component: OrderBookingComponent;
  let fixture: ComponentFixture<OrderBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
