import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastDealsComponent } from './past-deals.component';

describe('PastDealsComponent', () => {
  let component: PastDealsComponent;
  let fixture: ComponentFixture<PastDealsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastDealsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
