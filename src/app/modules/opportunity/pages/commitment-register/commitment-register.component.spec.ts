import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitmentRegisterComponent } from './commitment-register.component';

describe('CommitmentRegisterComponent', () => {
  let component: CommitmentRegisterComponent;
  let fixture: ComponentFixture<CommitmentRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitmentRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitmentRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
