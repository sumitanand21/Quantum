import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProspectAccountComponent } from './create-prospect-account.component';

describe('CreateProspectAccountComponent', () => {
  let component: CreateProspectAccountComponent;
  let fixture: ComponentFixture<CreateProspectAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProspectAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProspectAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
