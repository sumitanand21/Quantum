import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackOpportunityComponent } from './track-opportunity.component';

describe('TrackOpportunityComponent', () => {
  let component: TrackOpportunityComponent;
  let fixture: ComponentFixture<TrackOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
