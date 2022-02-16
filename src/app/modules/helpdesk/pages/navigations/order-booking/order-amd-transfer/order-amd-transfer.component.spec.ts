import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAMDTransferComponent } from './order-amd-transfer.component';

describe('OrderAMDTransferComponent', () => {
  let component: OrderAMDTransferComponent;
  let fixture: ComponentFixture<OrderAMDTransferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAMDTransferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAMDTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
