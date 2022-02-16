import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementalOpportunityComponent } from './incremental-opportunity.component';

describe('IncrementalOpportunityComponent', () => {
  let component: IncrementalOpportunityComponent;
  let fixture: ComponentFixture<IncrementalOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncrementalOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncrementalOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
