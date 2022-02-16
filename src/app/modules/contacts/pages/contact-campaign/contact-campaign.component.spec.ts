import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCampaignComponent } from './contact-campaign.component';

describe('ContactCampaignComponent', () => {
  let component: ContactCampaignComponent;
  let fixture: ComponentFixture<ContactCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
