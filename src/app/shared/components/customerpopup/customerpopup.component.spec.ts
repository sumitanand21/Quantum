import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerpopupComponent } from './customerpopup.component';

describe('CustomerpopupComponent', () => {
  let component: CustomerpopupComponent;
  let fixture: ComponentFixture<CustomerpopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerpopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
