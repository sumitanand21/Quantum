import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsLandingComponent } from './contacts-landing.component';

describe('ContactsLandingComponent', () => {
  let component: ContactsLandingComponent;
  let fixture: ComponentFixture<ContactsLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
