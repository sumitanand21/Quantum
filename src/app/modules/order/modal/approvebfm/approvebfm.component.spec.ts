import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovebfmComponent } from './approvebfm.component';

describe('ApprovebfmComponent', () => {
  let component: ApprovebfmComponent;
  let fixture: ComponentFixture<ApprovebfmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovebfmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovebfmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
