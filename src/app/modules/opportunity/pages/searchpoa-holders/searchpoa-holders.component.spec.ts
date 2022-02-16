import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchpoaHoldersComponent } from './searchpoa-holders.component';

describe('SearchpoaHoldersComponent', () => {
  let component: SearchpoaHoldersComponent;
  let fixture: ComponentFixture<SearchpoaHoldersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchpoaHoldersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchpoaHoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
