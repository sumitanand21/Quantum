import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRejectionSelectorComponent } from './order-rejection-selector.component';

describe('OrderRejectionSelectorComponent', () => {
  let component: OrderRejectionSelectorComponent;
  let fixture: ComponentFixture<OrderRejectionSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderRejectionSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRejectionSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
