import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContractRepositoryComponent } from '@app/modules/account/pages/account-contracts/tabs/contract-repository/contract-repository.component';

// import { ContractRepositoryComponent } from './contract-repository.component';

describe('ContractRepositoryComponent', () => {
  let component: ContractRepositoryComponent;
  let fixture: ComponentFixture<ContractRepositoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContractRepositoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractRepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
