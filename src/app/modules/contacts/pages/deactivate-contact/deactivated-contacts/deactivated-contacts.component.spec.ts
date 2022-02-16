import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivatedContactsComponent } from './deactivated-contacts.component';

describe('DeactivatedContactsComponent', () => {
  let component: DeactivatedContactsComponent;
  let fixture: ComponentFixture<DeactivatedContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivatedContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivatedContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
