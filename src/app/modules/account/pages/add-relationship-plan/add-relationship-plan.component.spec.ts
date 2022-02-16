import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelationshipPlanComponent } from './add-relationship-plan.component';

describe('AddRelationshipPlanComponent', () => {
  let component: AddRelationshipPlanComponent;
  let fixture: ComponentFixture<AddRelationshipPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRelationshipPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelationshipPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
