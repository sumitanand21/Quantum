import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingDealDetailsComponent } from './existing-deal-details.component';

describe('ExistingDealDetailsComponent', () => {
  let component: ExistingDealDetailsComponent;
  let fixture: ComponentFixture<ExistingDealDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingDealDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingDealDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
