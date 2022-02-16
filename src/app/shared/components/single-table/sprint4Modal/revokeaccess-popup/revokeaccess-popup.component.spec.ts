import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeaccessPopupComponent } from './revokeaccess-popup.component';

describe('RevokeaccessPopupComponent', () => {
  let component: RevokeaccessPopupComponent;
  let fixture: ComponentFixture<RevokeaccessPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevokeaccessPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeaccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
