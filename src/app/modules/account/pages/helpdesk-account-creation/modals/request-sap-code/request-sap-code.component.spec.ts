import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestSapCodeComponent } from './request-sap-code.component';

describe('RequestSapCodeComponent', () => {
  let component: RequestSapCodeComponent;
  let fixture: ComponentFixture<RequestSapCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestSapCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestSapCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
