import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { JsonApiService } from './json-api.service';
import { ApiService } from './api.service';

const routes = {
    employeeImage: 'v1/EmployeeManagement/EmployeeImage'
};

@Injectable({
    providedIn: 'root'
})

export class ProfileImgService {
    constructor(private jsonApiService: JsonApiService,
        private apiService: ApiService) {
    }
    getProfileImg(object: {}): Observable<any> {
        return this.apiService.post(routes.employeeImage, object);
    }
}
