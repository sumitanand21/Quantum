import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealCommercialsComponent } from './deal-commercials.component';

describe('DealCommercialsComponent', () => {
  let component: DealCommercialsComponent;
  let fixture: ComponentFixture<DealCommercialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealCommercialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealCommercialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
