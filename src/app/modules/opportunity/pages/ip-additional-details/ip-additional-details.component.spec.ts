import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpAdditionalDetailsComponent } from './ip-additional-details.component';

describe('IpAdditionalDetailsComponent', () => {
  let component: IpAdditionalDetailsComponent;
  let fixture: ComponentFixture<IpAdditionalDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpAdditionalDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpAdditionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
