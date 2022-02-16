import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachDocumentsComponent } from './attach-documents.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { SharedModule } from '@app/shared';

describe('AttachDocumentsComponent', () => {
  let component: AttachDocumentsComponent;
  let fixture: ComponentFixture<AttachDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttachDocumentsComponent ],
      imports: [SharedModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onCreate', () => {
    const fixture = TestBed.createComponent(AttachDocumentsComponent);
    fixture.detectChanges();
    const temp = fixture.debugElement.componentInstance;
    expect(temp.add({name: 'Karma testcase 1', parent: null})).toEqual('Success');
  });

});
