import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityGuidelineComponent } from './opportunity-guideline.component';

describe('OpportunityGuidelineComponent', () => {
  let component: OpportunityGuidelineComponent;
  let fixture: ComponentFixture<OpportunityGuidelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityGuidelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityGuidelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
