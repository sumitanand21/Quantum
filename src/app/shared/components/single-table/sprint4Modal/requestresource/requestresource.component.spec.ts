import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestresourceComponent } from './requestresource.component';

describe('RequestresourceComponent', () => {
  let component: RequestresourceComponent;
  let fixture: ComponentFixture<RequestresourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestresourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestresourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
