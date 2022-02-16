import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnalystRelationsComponent } from './add-analyst-relations.component';

describe('AddAnalystRelationsComponent', () => {
  let component: AddAnalystRelationsComponent;
  let fixture: ComponentFixture<AddAnalystRelationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAnalystRelationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAnalystRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
