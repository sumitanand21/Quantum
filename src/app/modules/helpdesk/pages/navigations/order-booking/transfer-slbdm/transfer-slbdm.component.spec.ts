import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferSLBDMComponent } from './transfer-slbdm.component';

describe('TransferSLBDMComponent', () => {
  let component: TransferSLBDMComponent;
  let fixture: ComponentFixture<TransferSLBDMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferSLBDMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferSLBDMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
