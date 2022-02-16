import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityMoreViewComponent } from './activity-more-view.component';

describe('ActivityMoreViewComponent', () => {
  let component: ActivityMoreViewComponent;
  let fixture: ComponentFixture<ActivityMoreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityMoreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityMoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
