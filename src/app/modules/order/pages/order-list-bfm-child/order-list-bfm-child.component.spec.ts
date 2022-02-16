import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListBfmChildComponent } from './order-list-bfm-child.component';

describe('OrderListBfmChildComponent', () => {
  let component: OrderListBfmChildComponent;
  let fixture: ComponentFixture<OrderListBfmChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderListBfmChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListBfmChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
