import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCompletecampaignComponent } from './contact-completecampaign.component';

describe('ContactCompletecampaignComponent', () => {
  let component: ContactCompletecampaignComponent;
  let fixture: ComponentFixture<ContactCompletecampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactCompletecampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCompletecampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
