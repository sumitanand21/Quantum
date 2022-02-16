import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvancedSearchRoutingModule } from './advanced-search-routing.module';
import { AdvancedSearchComponent } from './advanced-search.component';
import { SharedModule } from '@app/shared';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'

@NgModule({
  declarations: [
    AdvancedSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule, 
    ReactiveFormsModule,
    AdvancedSearchRoutingModule
  ]
})
export class AdvancedSearchModule { }
