import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSapUploadComponent } from './account-sap-upload.component';

describe('AccountSapUploadComponent', () => {
  let component: AccountSapUploadComponent;
  let fixture: ComponentFixture<AccountSapUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSapUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSapUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
