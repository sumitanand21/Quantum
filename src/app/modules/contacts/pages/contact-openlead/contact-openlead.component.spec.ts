import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactOpenleadComponent } from './contact-openlead.component';

describe('ContactOpenleadComponent', () => {
  let component: ContactOpenleadComponent;
  let fixture: ComponentFixture<ContactOpenleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactOpenleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactOpenleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
