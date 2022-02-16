import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReopenApprovalsComponent } from './reopen-approvals.component';

describe('ReopenApprovalsComponent', () => {
  let component: ReopenApprovalsComponent;
  let fixture: ComponentFixture<ReopenApprovalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReopenApprovalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReopenApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
