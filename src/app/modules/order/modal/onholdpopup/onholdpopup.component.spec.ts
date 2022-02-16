import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnholdpopupComponent } from './onholdpopup.component';

describe('OnholdpopupComponent', () => {
  let component: OnholdpopupComponent;
  let fixture: ComponentFixture<OnholdpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnholdpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnholdpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
