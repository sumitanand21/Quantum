import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealTeamComponent } from './deal-team.component';

describe('DealTeamComponent', () => {
  let component: DealTeamComponent;
  let fixture: ComponentFixture<DealTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
