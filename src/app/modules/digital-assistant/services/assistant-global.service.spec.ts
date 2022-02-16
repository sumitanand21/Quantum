import { TestBed } from '@angular/core/testing';

import { AssistantGlobalService } from './assistant-global.service';

describe('AssistantGlobalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssistantGlobalService = TestBed.get(AssistantGlobalService);
    expect(service).toBeTruthy();
  });
});
