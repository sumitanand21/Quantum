import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListAdhChildComponent } from './order-list-adh-child.component';

describe('OrderListAdhChildComponent', () => {
  let component: OrderListAdhChildComponent;
  let fixture: ComponentFixture<OrderListAdhChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderListAdhChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListAdhChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
