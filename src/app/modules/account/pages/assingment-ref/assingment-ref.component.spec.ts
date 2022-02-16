import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentRef } from './assingment-ref.component';


describe('AssignmentRef', () => {
  let component: AssignmentRef;
  let fixture: ComponentFixture<AssignmentRef>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignmentRef ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentRef);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
