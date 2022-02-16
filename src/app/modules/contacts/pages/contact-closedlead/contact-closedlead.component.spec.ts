import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactClosedleadComponent } from './contact-closedlead.component';

describe('ContactClosedleadComponent', () => {
  let component: ContactClosedleadComponent;
  let fixture: ComponentFixture<ContactClosedleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactClosedleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactClosedleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
