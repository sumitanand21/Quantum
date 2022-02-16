import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactAllcampaignComponent } from './contact-allcampaign.component';

describe('ContactAllcampaignComponent', () => {
  let component: ContactAllcampaignComponent;
  let fixture: ComponentFixture<ContactAllcampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactAllcampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactAllcampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
