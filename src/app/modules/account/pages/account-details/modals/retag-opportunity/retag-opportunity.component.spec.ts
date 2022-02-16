import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetagOpportunityComponent } from './retag-opportunity.component';

describe('RetagOpportunityComponent', () => {
  let component: RetagOpportunityComponent;
  let fixture: ComponentFixture<RetagOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetagOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetagOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
