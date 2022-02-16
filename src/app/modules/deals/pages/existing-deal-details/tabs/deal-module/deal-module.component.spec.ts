import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealModuleComponent } from './deal-module.component';

describe('DealModuleComponent', () => {
  let component: DealModuleComponent;
  let fixture: ComponentFixture<DealModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
