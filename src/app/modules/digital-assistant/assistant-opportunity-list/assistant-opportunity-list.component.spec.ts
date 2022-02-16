import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantOpportunityListComponent } from './assistant-opportunity-list.component';

describe('AssistantOpportunityListComponent', () => {
  let component: AssistantOpportunityListComponent;
  let fixture: ComponentFixture<AssistantOpportunityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantOpportunityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantOpportunityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
