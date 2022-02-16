import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityExpansionTeamComponent } from './opportunity-expansion-team.component';

describe('OpportunityExpansionTeamComponent', () => {
  let component: OpportunityExpansionTeamComponent;
  let fixture: ComponentFixture<OpportunityExpansionTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityExpansionTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityExpansionTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
