import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicelinepopupComponent } from './servicelinepopup.component';

describe('ServicelinepopupComponent', () => {
  let component: ServicelinepopupComponent;
  let fixture: ComponentFixture<ServicelinepopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicelinepopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicelinepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
