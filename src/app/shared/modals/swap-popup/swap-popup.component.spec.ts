import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SwapPopupComponent } from './swap-popup.component';

describe('SwapPopupComponent', () => {
  let component: SwapPopupComponent;
  let fixture: ComponentFixture<SwapPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SwapPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwapPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
