import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantOpportunityOverviewComponent } from './assistant-opportunity-overview.component';

describe('AssistantOpportunityOverviewComponent', () => {
  let component: AssistantOpportunityOverviewComponent;
  let fixture: ComponentFixture<AssistantOpportunityOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantOpportunityOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantOpportunityOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
