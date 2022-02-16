export interface GetMeetingFrequency {
    ResponseObject: meetingFrequency[];
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number;
  }
  
  export interface meetingFrequency {
    Id: number;
    Value: string;
  }