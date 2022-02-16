import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMoreViewComponent } from './contact-more-view.component';

describe('ContactMoreViewComponent', () => {
  let component: ContactMoreViewComponent;
  let fixture: ComponentFixture<ContactMoreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactMoreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactMoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
