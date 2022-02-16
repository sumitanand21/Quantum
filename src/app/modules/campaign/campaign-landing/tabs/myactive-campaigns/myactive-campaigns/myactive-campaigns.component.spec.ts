import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyactiveCampaignsComponent } from './myactive-campaigns.component';

describe('MyactiveCampaignsComponent', () => {
  let component: MyactiveCampaignsComponent;
  let fixture: ComponentFixture<MyactiveCampaignsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyactiveCampaignsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyactiveCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
