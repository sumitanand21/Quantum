import { TestBed } from '@angular/core/testing';

import { NewMeetingService } from './new-meeting.service';

describe('NewMeetingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewMeetingService = TestBed.get(NewMeetingService);
    expect(service).toBeTruthy();
  });
});
