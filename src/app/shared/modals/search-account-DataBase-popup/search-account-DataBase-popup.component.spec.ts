import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAccountDataBasePopupComponent } from './search-account-DataBase-popup.component';

describe('SearchAccountDataBasePopupComponent', () => {
  let component: SearchAccountDataBasePopupComponent;
  let fixture: ComponentFixture<SearchAccountDataBasePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAccountDataBasePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAccountDataBasePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
