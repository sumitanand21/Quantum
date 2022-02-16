import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMoreViewComponent } from './order-more-view.component';

describe('OrderMoreViewComponent', () => {
  let component: OrderMoreViewComponent;
  let fixture: ComponentFixture<OrderMoreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMoreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
