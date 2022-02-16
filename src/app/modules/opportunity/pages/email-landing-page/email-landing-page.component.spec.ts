import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLandingPageComponent } from './email-landing-page.component';

describe('EmailLandingPageComponent', () => {
  let component: EmailLandingPageComponent;
  let fixture: ComponentFixture<EmailLandingPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailLandingPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
