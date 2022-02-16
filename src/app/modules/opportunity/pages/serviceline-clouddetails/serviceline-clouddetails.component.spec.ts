import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicelineClouddetailsComponent } from './serviceline-clouddetails.component';

describe('ServicelineClouddetailsComponent', () => {
  let component: ServicelineClouddetailsComponent;
  let fixture: ComponentFixture<ServicelineClouddetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicelineClouddetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicelineClouddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
