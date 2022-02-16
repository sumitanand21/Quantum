import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAmendmentChildComponent } from './create-amendment-child.component';

describe('CreateAmendmentChildComponent', () => {
  let component: CreateAmendmentChildComponent;
  let fixture: ComponentFixture<CreateAmendmentChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAmendmentChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAmendmentChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
