import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewActionComponent } from './create-new-action.component';

describe('CreateNewActionComponent', () => {
  let component: CreateNewActionComponent;
  let fixture: ComponentFixture<CreateNewActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('Number -2+3:', () => {
  //   const fixture = TestBed.createComponent(CreateNewActionComponent);
  //   fixture.detectChanges();
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.add(-2, 3)).toEqual(5);
  // });
});
