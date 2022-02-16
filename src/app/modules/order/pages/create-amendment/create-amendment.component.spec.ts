import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAmendmentComponent } from './create-amendment.component';

describe('CreateAmendmentComponent', () => {
  let component: CreateAmendmentComponent;
  let fixture: ComponentFixture<CreateAmendmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAmendmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAmendmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
