import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { ConversationEffects } from './conversation.effects'

describe('EffectsEffects', () => {
  let actions$: Observable<any>;
  let effects: ConversationEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConversationEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(ConversationEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
