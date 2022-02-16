import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewTargetComponent } from './preview-target.component';

describe('PreviewTargetComponent', () => {
  let component: PreviewTargetComponent;
  let fixture: ComponentFixture<PreviewTargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewTargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
