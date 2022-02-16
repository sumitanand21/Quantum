import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateamendmentComponent } from './createamendment.component';

describe('CreateamendmentComponent', () => {
  let component: CreateamendmentComponent;
  let fixture: ComponentFixture<CreateamendmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateamendmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateamendmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
