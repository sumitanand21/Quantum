import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderBfmExpansionComponent } from './order-bfm-expansion.component';

describe('OrderBfmExpansionComponent', () => {
  let component: OrderBfmExpansionComponent;
  let fixture: ComponentFixture<OrderBfmExpansionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBfmExpansionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderBfmExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
