import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgeBusinessPartnerComponent } from './new-age-business-partner.component';

describe('NewAgeBusinessPartnerComponent', () => {
  let component: NewAgeBusinessPartnerComponent;
  let fixture: ComponentFixture<NewAgeBusinessPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAgeBusinessPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAgeBusinessPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
