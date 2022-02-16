export interface GetRelationship {
    ResponseObject: Relationship[];
    IsError: boolean;
    Severity: number;
}
export interface Relationship {
    Id: number;
    Value: string;
}