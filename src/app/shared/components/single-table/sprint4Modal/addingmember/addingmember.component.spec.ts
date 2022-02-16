import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingmemberComponent } from './addingmember.component';

describe('AddingmemberComponent', () => {
  let component: AddingmemberComponent;
  let fixture: ComponentFixture<AddingmemberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddingmemberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingmemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
