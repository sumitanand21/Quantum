import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadRlsComponent } from './upload-rls.component';

describe('UploadRlsComponent', () => {
  let component: UploadRlsComponent;
  let fixture: ComponentFixture<UploadRlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadRlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadRlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
