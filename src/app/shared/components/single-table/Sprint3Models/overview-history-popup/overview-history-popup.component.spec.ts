import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewHistoryPopupComponent } from './overview-history-popup.component';

describe('OverviewHistoryPopupComponent', () => {
  let component: OverviewHistoryPopupComponent;
  let fixture: ComponentFixture<OverviewHistoryPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewHistoryPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewHistoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
