import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountMergeComponent, mergereqcomponent  } from './account-merge/account-merge.component';
import { AccDelMgrChangeComponent,managerchangecomponent } from './acc-del-mgr-change/acc-del-mgr-change.component';
import { SharedModule } from '@app/shared';
import { AccountMergeLandingComponent,mergepopComponent } from './pages/account-merge-landing/account-merge-landing.component';
import { RequestDetailsComponent } from './pages/request-details/request-details.component';
import { SourceAccountComponent } from './pages/source-account/source-account.component';
import { TargetAccountComponent } from './pages/target-account/target-account.component';
import { PreviewTargetComponent } from './pages/preview-target/preview-target.component';
import { MergeSummaryComponent } from './pages/merge-summary/merge-summary.component';
import { ResultComponent } from './pages/result/result.component';
import { SecondaryOwnerViewComponent } from './pages/secondary-owner-view/secondary-owner-view.component';
const popupsComponent = [
  managerchangecomponent,
  mergepopComponent,
  mergereqcomponent, 
  SecondaryOwnerViewComponent
]
@NgModule({
  declarations: [AccountMergeComponent, AccDelMgrChangeComponent,popupsComponent, AccountMergeLandingComponent, RequestDetailsComponent, SourceAccountComponent, TargetAccountComponent, PreviewTargetComponent, MergeSummaryComponent, ResultComponent],
  entryComponents: popupsComponent,
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class AccountActionsModule { }
