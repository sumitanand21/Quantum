import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateActivityGroupModelComponent } from './create-activity-group-model.component';

describe('CreateActivityGroupModelComponent', () => {
  let component: CreateActivityGroupModelComponent;
  let fixture: ComponentFixture<CreateActivityGroupModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateActivityGroupModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateActivityGroupModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
