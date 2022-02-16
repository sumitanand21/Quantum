import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHierarchyComponent } from './order-hierarchy.component';

describe('OrderHierarchyComponent', () => {
  let component: OrderHierarchyComponent;
  let fixture: ComponentFixture<OrderHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
