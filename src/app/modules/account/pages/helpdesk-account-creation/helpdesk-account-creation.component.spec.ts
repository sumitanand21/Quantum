import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpdeskAccountCreationComponent } from './helpdesk-account-creation.component';

describe('HelpdeskAccountCreationComponent', () => {
  let component: HelpdeskAccountCreationComponent;
  let fixture: ComponentFixture<HelpdeskAccountCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpdeskAccountCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpdeskAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
