import { TestBed } from '@angular/core/testing';

import { NewAuthConfigService } from './new-auth-config.service';

describe('NewAuthConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewAuthConfigService = TestBed.get(NewAuthConfigService);
    expect(service).toBeTruthy();
  });
});
