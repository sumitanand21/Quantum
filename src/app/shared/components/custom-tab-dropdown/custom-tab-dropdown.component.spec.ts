import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabDropdownComponent } from './custom-tab-dropdown.component';

describe('CustomTabDropdownComponent', () => {
  let component: CustomTabDropdownComponent;
  let fixture: ComponentFixture<CustomTabDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTabDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
