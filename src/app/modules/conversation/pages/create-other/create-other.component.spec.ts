import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOtherComponent } from './create-other.component';

describe('CreateOtherComponent', () => {
  let component: CreateOtherComponent;
  let fixture: ComponentFixture<CreateOtherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOtherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
