import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExisingDealsSelectorComponent } from './exising-deals-selector.component';

describe('ExisingDealsSelectorComponent', () => {
  let component: ExisingDealsSelectorComponent;
  let fixture: ComponentFixture<ExisingDealsSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExisingDealsSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExisingDealsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
