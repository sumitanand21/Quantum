import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigCreationHistoryComponent } from './assig-creation-history.component';


describe('AssigCreationHistoryComponent', () => {
  let component: AssigCreationHistoryComponent;
  let fixture: ComponentFixture<AssigCreationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigCreationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigCreationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
