import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareopportunityPopupComponent } from './shareopportunity-popup.component';

describe('ShareopportunityPopupComponent', () => {
  let component: ShareopportunityPopupComponent;
  let fixture: ComponentFixture<ShareopportunityPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareopportunityPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareopportunityPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
