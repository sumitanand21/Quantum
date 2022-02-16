import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDetailLandingComponent } from './contact-detail-landing.component';

describe('ContactDetailLandingComponent', () => {
  let component: ContactDetailLandingComponent;
  let fixture: ComponentFixture<ContactDetailLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDetailLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
