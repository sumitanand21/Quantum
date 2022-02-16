import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyopenOpportunitiesComponent } from './myopen-opportunities.component';

describe('MyopenOpportunitiesComponent', () => {
  let component: MyopenOpportunitiesComponent;
  let fixture: ComponentFixture<MyopenOpportunitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyopenOpportunitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyopenOpportunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
