import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerChangeOppComponent } from './owner-change-opp.component';

describe('OwnerChangeOppComponent', () => {
  let component: OwnerChangeOppComponent;
  let fixture: ComponentFixture<OwnerChangeOppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerChangeOppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerChangeOppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
