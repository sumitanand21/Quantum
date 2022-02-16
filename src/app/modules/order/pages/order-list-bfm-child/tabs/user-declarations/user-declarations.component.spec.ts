import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDeclarationsComponent } from './user-declarations.component';

describe('UserDeclarationsComponent', () => {
  let component: UserDeclarationsComponent;
  let fixture: ComponentFixture<UserDeclarationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserDeclarationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDeclarationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
