import { Injectable } from "@angular/core";
import { ApiServiceDeal } from "../api.service";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { HttpClient } from "@angular/common/http";
import { OfflineService } from "../offline.services";
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
  proposalCreate: "api/v5/proposal/create",
  proposalEdit: "api/v5/proposal/editproposal",
  proposalDelete: "api/v5/proposal/delete",
  proposalLock: "api/v5/proposal/lock",
  proposalList: "api/v5/proposal/list",
  proposalStatus: "api/v5/proposal/getstatus",
  proposalActionRedirect: "api/v5/Proposal/RedirectToAction",
  proposalDocumentUpload: "api/v5/DealFolder/UploadProposalDocument_V1",
  wittyMoveToNext: "api/v5/WittyParrot/MoveToNext",
  wittyMoveToDraft: "api/v5/WittyParrot/MoveToDraft",
  dealTeams: "api/v5/Proposal/getTeams",
  proposalChangeStatus: "api/v5/Proposal/ChangeStatus"
}

const API_BASE_URL = envADAL.sprint5BaseUrl.QaURL5A;

@Injectable({
  providedIn: "root"
})
export class ProposalService {
  constructor(private apiServiceDeal: ApiServiceDeal,
    private http: HttpClient,
    private offlineServices: OfflineService,) { }

  create(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalCreate, payload);
  }

  editDocument(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalEdit, payload);
  }

  lockDocument(payload): Observable<any> {
    console.log(payload);
    return this.apiServiceDeal.post(routes.proposalLock, payload);
  }

  proposals(payload): Observable<any[]> {
    return this.apiServiceDeal.post(routes.proposalList, payload);
  }

  deleteProposal(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalDelete, payload);
  }

  editProposal(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalDelete, payload);
  }

  proposalActionRedirect(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalActionRedirect, payload);
  }

  uploadProposalTemplate(file): Observable<any> {
    return this.http.post(API_BASE_URL + routes.proposalDocumentUpload, file);
  }

  sectionMoveToNext(payload) {
    // api/v5/WittyParrot/MoveToNext
    return this.apiServiceDeal.post(routes.wittyMoveToNext, payload);
  }

  sectionMoveToDraft(payload) {
    // api/v5/WittyParrot/MoveToDraft
    return this.apiServiceDeal.post(routes.wittyMoveToDraft, payload);
  }


  proposalStatusChange(payload) {
    // api/v5/Proposal/ChangeStatus
    return this.apiServiceDeal.post(routes.proposalChangeStatus, payload);
  }

  async getDealTechSolutionCacheData() {
    console.log("get dealtechsolution cache data--->");
    const TablePageData = await this.offlineServices.getDealTechSolutionIndexCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }


}