import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllOpportunitiesComponent } from './show-all-opportunities.component';

describe('ShowAllOpportunitiesComponent', () => {
  let component: ShowAllOpportunitiesComponent;
  let fixture: ComponentFixture<ShowAllOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowAllOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowAllOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
