import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSecondaryOwnersComponent } from './add-secondary-owners.component';

describe('AddSecondaryOwnersComponent', () => {
  let component: AddSecondaryOwnersComponent;
  let fixture: ComponentFixture<AddSecondaryOwnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSecondaryOwnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSecondaryOwnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
