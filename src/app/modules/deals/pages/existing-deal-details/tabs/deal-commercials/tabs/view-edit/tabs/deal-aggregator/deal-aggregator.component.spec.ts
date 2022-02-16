import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealAggregatorComponent } from './deal-aggregator.component';

describe('DealAggregatorComponent', () => {
  let component: DealAggregatorComponent;
  let fixture: ComponentFixture<DealAggregatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealAggregatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealAggregatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
