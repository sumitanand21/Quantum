import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProspectAccountCreationComponent } from './prospect-account-creation.component';

describe('ProspectAccountCreationComponent', () => {
  let component: ProspectAccountCreationComponent;
  let fixture: ComponentFixture<ProspectAccountCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProspectAccountCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProspectAccountCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
