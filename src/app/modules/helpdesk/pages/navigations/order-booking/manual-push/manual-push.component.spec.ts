import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualPushComponent } from './manual-push.component';

describe('ManualPushComponent', () => {
  let component: ManualPushComponent;
  let fixture: ComponentFixture<ManualPushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualPushComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualPushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
