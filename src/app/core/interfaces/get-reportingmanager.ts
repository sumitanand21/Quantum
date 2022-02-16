export interface GetReportingManager {
    ResponseObject: ReportingManager[];
    IsError: boolean;
    Severity: number;
  }
  
 export interface ReportingManager {
    UserId: string;
    EmpNo: number;
    FullName: string;
    FName: string;
    LName: string;
    Email: string;
    IsMale: boolean;
    ownerId: string;
  }