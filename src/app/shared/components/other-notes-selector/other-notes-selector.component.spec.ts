import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherNotesSelectorComponent } from './other-notes-selector.component';

describe('OtherNotesSelectorComponent', () => {
  let component: OtherNotesSelectorComponent;
  let fixture: ComponentFixture<OtherNotesSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherNotesSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherNotesSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
