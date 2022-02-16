import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkTeamMemberComponent } from './add-bulk-team-member.component';

describe('AddBulkTeamMemberComponent', () => {
  let component: AddBulkTeamMemberComponent;
  let fixture: ComponentFixture<AddBulkTeamMemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBulkTeamMemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBulkTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
