import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealDashboardReportComponent } from './deal-dashboard-report.component';

describe('DealDashboardReportComponent', () => {
  let component: DealDashboardReportComponent;
  let fixture: ComponentFixture<DealDashboardReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealDashboardReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealDashboardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
