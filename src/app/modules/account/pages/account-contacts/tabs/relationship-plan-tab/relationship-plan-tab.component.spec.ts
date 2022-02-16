import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipPlanTabComponent } from './relationship-plan-tab.component';

describe('RelationshipPlanTabComponent', () => {
  let component: RelationshipPlanTabComponent;
  let fixture: ComponentFixture<RelationshipPlanTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationshipPlanTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipPlanTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
