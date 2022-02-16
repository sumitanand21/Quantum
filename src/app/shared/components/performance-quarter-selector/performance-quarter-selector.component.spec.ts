import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceQuarterSelectorComponent } from './performance-quarter-selector.component';

describe('PerformanceQuarterSelectorComponent', () => {
  let component: PerformanceQuarterSelectorComponent;
  let fixture: ComponentFixture<PerformanceQuarterSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerformanceQuarterSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerformanceQuarterSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
