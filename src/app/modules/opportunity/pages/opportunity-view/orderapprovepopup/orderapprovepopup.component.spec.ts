import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderapprovepopupComponent } from './orderapprovepopup.component';

describe('OrderapprovepopupComponent', () => {
  let component: OrderapprovepopupComponent;
  let fixture: ComponentFixture<OrderapprovepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderapprovepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderapprovepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
