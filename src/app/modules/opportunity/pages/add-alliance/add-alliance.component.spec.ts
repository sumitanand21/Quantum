import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllianceComponent } from './add-alliance.component';

describe('AddAllianceComponent', () => {
  let component: AddAllianceComponent;
  let fixture: ComponentFixture<AddAllianceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAllianceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAllianceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
