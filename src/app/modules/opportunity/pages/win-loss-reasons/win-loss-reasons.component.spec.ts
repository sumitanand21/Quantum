import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WinLossReasonsComponent } from './win-loss-reasons.component';

describe('WinLossReasonsComponent', () => {
  let component: WinLossReasonsComponent;
  let fixture: ComponentFixture<WinLossReasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WinLossReasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WinLossReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
