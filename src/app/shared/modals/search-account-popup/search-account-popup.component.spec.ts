import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAccountPopupComponent } from './search-account-popup.component';

describe('SearchAccountPopupComponent', () => {
  let component: SearchAccountPopupComponent;
  let fixture: ComponentFixture<SearchAccountPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAccountPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAccountPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
