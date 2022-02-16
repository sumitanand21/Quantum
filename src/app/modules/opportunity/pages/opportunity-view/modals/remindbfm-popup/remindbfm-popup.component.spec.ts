import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemindbfmPopupComponent } from './remindbfm-popup.component';

describe('RemindbfmPopupComponent', () => {
  let component: RemindbfmPopupComponent;
  let fixture: ComponentFixture<RemindbfmPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemindbfmPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemindbfmPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
