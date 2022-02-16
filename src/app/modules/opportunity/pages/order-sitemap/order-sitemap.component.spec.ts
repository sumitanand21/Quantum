import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSitemapComponent } from './order-sitemap.component';

describe('OrderSitemapComponent', () => {
  let component: OrderSitemapComponent;
  let fixture: ComponentFixture<OrderSitemapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderSitemapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSitemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
