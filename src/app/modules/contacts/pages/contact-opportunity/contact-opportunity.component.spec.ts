import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactOpportunityComponent } from './contact-opportunity.component';

describe('ContactOpportunityComponent', () => {
  let component: ContactOpportunityComponent;
  let fixture: ComponentFixture<ContactOpportunityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactOpportunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactOpportunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
