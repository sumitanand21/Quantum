import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceLineAdditionalDetailsComponent } from './service-line-additional-details.component';

describe('ServiceLineAdditionalDetailsComponent', () => {
  let component: ServiceLineAdditionalDetailsComponent;
  let fixture: ComponentFixture<ServiceLineAdditionalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceLineAdditionalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceLineAdditionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
