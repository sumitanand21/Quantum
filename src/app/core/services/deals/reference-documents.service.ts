import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { ApiServiceDeal } from "../api.service";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { EnvService } from "../env.service";

const envADAL = new EnvService();

// Read environment variables from browser window

const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

// Assign environment variables from browser window to env
// In the current implementation, properties from env.js overwrite defaults from the EnvService.

// If needed, a deep merge can be performed here to merge properties instead of overwriting them.

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {

    envADAL[key] = window['__env'][key];
  }
}
const routes = {
    dealFolderEdit: "api/v5/dealfolder/edit",
    dealFolderMove: "api/v5/dealfolder/movefolder",
    dealMultiFolderMove: "api/v5/dealfile/movemultiple",
    dealFolderCreate: "api/v5/dealFolder/create",
    dealFileCreate: "api/v5/dealFile/create",
    dealFolderDelete: "api/v5/dealFolder/delete",
    dealMultiFolderDelete: "api/v5/dealFolder/deletemultiple",
    dealFileList: "api/v5/DealFile/list",
}

const API_BASE_URL = envADAL.sprint5BaseUrl.QaURL5A;
@Injectable({
    providedIn: "root"
})
export class ReferenceDocumentService {

    constructor(private apiServiceDeal: ApiServiceDeal,
        private http: HttpClient) { }

    listFolder(payload): Observable<any[]> {
        return this.apiServiceDeal.post(routes.dealFileList, payload);
    }

    editFolder(payload): Observable<any> {
        return this.apiServiceDeal.post(routes.dealFolderEdit, payload);
    }

    moveFile(payload): Observable<any> {
        return this.apiServiceDeal.post(routes.dealFolderMove, payload);
    }

    moveFiles(payload): Observable<any> {
        return this.apiServiceDeal.post(routes.dealMultiFolderMove, payload);
    }

    createFolder(payload): Observable<any> {
        return this.apiServiceDeal.post(routes.dealFolderCreate, payload);
    }

    deleteFolder(payload): Observable<any> {
        return this.apiServiceDeal.post(routes.dealFolderDelete, payload);
    }

    deleteFolders(payload): Observable<any> {
        return this.apiServiceDeal.post(routes.dealMultiFolderDelete, payload);
    }

}