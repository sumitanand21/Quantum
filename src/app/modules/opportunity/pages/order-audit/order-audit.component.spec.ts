import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAuditComponent } from './order-audit.component';

describe('OrderAuditComponent', () => {
  let component: OrderAuditComponent;
  let fixture: ComponentFixture<OrderAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
