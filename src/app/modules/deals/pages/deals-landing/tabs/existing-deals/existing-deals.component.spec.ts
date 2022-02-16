import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingDealsComponent } from './existing-deals.component';

describe('ExistingDealsComponent', () => {
  let component: ExistingDealsComponent;
  let fixture: ComponentFixture<ExistingDealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingDealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
