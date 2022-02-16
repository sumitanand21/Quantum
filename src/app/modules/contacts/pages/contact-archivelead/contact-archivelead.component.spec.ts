import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactArchiveleadComponent } from './contact-archivelead.component';

describe('ContactArchiveleadComponent', () => {
  let component: ContactArchiveleadComponent;
  let fixture: ComponentFixture<ContactArchiveleadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactArchiveleadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactArchiveleadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
