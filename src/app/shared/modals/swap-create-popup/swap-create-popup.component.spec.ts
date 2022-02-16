import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapCreatePopupComponent } from './swap-create-popup.component';

describe('SwapCreatePopupComponent', () => {
  let component: SwapCreatePopupComponent;
  let fixture: ComponentFixture<SwapCreatePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapCreatePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapCreatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
