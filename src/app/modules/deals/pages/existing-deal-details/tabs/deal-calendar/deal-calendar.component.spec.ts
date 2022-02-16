import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealCalendarComponent } from './deal-calendar.component';

describe('DealCalendarComponent', () => {
  let component: DealCalendarComponent;
  let fixture: ComponentFixture<DealCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
