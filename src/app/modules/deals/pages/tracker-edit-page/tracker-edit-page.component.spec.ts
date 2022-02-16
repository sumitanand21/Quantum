import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackerEditPageComponent } from './tracker-edit-page.component';

describe('TrackerEditPageComponent', () => {
  let component: TrackerEditPageComponent;
  let fixture: ComponentFixture<TrackerEditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackerEditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackerEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
