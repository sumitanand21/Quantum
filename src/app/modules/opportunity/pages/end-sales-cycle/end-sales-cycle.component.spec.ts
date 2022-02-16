import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndSalesCycleComponent } from './end-sales-cycle.component';

describe('EndSalesCycleComponent', () => {
  let component: EndSalesCycleComponent;
  let fixture: ComponentFixture<EndSalesCycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndSalesCycleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndSalesCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
