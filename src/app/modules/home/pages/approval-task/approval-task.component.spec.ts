import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalTaskComponent } from './approval-task.component';

describe('ApprovalTaskComponent', () => {
  let component: ApprovalTaskComponent;
  let fixture: ComponentFixture<ApprovalTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
