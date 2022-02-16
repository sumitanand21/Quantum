import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeOpportunityComponent } from './change-opportunity.component';

describe('ChangeOpportunityComponent', () => {
  let component: ChangeOpportunityComponent;
  let fixture: ComponentFixture<ChangeOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
