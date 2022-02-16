import { TestBed } from '@angular/core/testing';

import { AssistantSocketService } from './assistant-socket.service';

describe('AssistantSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AssistantSocketService = TestBed.get(AssistantSocketService);
    expect(service).toBeTruthy();
  });
});
