import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRejectmodifiedPopupComponent } from './order-rejectmodified-popup.component';

describe('OrderRejectmodifiedPopupComponent', () => {
  let component: OrderRejectmodifiedPopupComponent;
  let fixture: ComponentFixture<OrderRejectmodifiedPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRejectmodifiedPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRejectmodifiedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
