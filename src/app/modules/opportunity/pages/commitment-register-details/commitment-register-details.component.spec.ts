import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentRegisterDetailsComponent } from './commitment-register-details.component';

describe('CommitmentRegisterDetailsComponent', () => {
  let component: CommitmentRegisterDetailsComponent;
  let fixture: ComponentFixture<CommitmentRegisterDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitmentRegisterDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentRegisterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
