import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealOverviewComponent } from './deal-overview.component';

describe('DealOverviewComponent', () => {
  let component: DealOverviewComponent;
  let fixture: ComponentFixture<DealOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
