import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { MatAutocompleteSelectedEvent } from '@angular/material';

export interface State {
  subhead: string;
  name: string;
  population: string;
} 

@Component({
  selector: 'app-control-search',
  templateUrl: './control-search.component.html',
  styleUrls: ['./control-search.component.scss']
})
export class ControlSearchComponent {
  @Input()
  public control: FormControl;
  @Input()
  public labelName?: string;

  stateCtrl = new FormControl();
  filteredStates: Observable<State[]>;
  states: State[] = [
    {
      name: 'Apple',
      population: 'Item 1',
      subhead: 'Account/Tagging 1'

    },
    {
      name: 'Apple',      
      population: 'Item 1',
      subhead: 'Opportunity/Tagging 1'

    },
    {
      name: 'Apple',      
      population: 'Item 1',
      subhead: 'Account/Tagging 2'
  
    },
  ];

  constructor() {

    this.filteredStates = this.stateCtrl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this._filterStates(state) : this.states.slice())
    );
  }

  private _filterStates(value: string): State[] {
    const filterValue = value.toLowerCase();

    return this.states.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {   
    
    document.getElementById('focus').blur();
  }

  
}
