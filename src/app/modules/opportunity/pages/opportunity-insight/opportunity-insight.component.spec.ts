import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityInsightComponent } from './opportunity-insight.component';

describe('OpportunityInsightComponent', () => {
  let component: OpportunityInsightComponent;
  let fixture: ComponentFixture<OpportunityInsightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityInsightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
