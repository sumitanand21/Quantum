import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SapPopupComponent } from './sap-popup.component';

describe('SapPopupComponent', () => {
  let component: SapPopupComponent;
  let fixture: ComponentFixture<SapPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SapPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
