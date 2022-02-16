import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditsolutionComponent } from './editsolution.component';

describe('EditsolutionComponent', () => {
  let component: EditsolutionComponent;
  let fixture: ComponentFixture<EditsolutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditsolutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditsolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
