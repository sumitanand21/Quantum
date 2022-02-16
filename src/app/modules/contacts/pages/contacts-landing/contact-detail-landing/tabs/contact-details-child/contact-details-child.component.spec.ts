import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactDetailsChildComponent } from './contact-details-child.component';



describe('ContactDetailsComponent', () => {
  let component: ContactDetailsChildComponent;
  let fixture: ComponentFixture<ContactDetailsChildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDetailsChildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailsChildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
