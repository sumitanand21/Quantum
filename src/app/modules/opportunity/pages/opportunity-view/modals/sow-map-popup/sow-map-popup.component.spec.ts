import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SowMapPopupComponent } from './sow-map-popup.component';

describe('SowMapPopupComponent', () => {
  let component: SowMapPopupComponent;
  let fixture: ComponentFixture<SowMapPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SowMapPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SowMapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
