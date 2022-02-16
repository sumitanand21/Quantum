export interface GetContactEnrichment {
    ResponseObject: contactEnrichment;
    IsError: boolean;
    Severity: number;
  }
  
 export interface contactEnrichment {
    Version: Version;
    StatusCode: number;
    ReasonPhrase: string;
    Headers: any[];
    IsSuccessStatusCode: boolean;
  }
  
  export interface Version {
    Major: number;
    Minor: number;
    Build: number;
    Revision: number;
    MajorRevision: number;
    MinorRevision: number;
  }