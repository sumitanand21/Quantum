import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAmendmentPopupComponent } from './create-amendment-popup.component';

describe('CreateAmendmentPopupComponent', () => {
  let component: CreateAmendmentPopupComponent;
  let fixture: ComponentFixture<CreateAmendmentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAmendmentPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAmendmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
