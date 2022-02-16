import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAssignmentReferenceComponent } from './create-assignment-reference.component';

describe('CreateAssignmentReferenceComponent', () => {
  let component: CreateAssignmentReferenceComponent;
  let fixture: ComponentFixture<CreateAssignmentReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssignmentReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAssignmentReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
