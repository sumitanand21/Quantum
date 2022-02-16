import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualChecksComponent } from './manual-checks.component';

describe('ManualChecksComponent', () => {
  let component: ManualChecksComponent;
  let fixture: ComponentFixture<ManualChecksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualChecksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
