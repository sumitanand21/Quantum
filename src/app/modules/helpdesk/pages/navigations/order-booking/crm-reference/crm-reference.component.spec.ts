import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CRMReferenceComponent } from './crm-reference.component';

describe('CRMReferenceComponent', () => {
  let component: CRMReferenceComponent;
  let fixture: ComponentFixture<CRMReferenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CRMReferenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CRMReferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
