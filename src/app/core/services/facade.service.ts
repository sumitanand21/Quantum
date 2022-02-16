import { Injectable, Injector } from "@angular/core";
import { ProposalService } from "./deals/proposal.service";
import { DealRoleService } from "./deals/deals-role.service";
import { ReferenceDocumentService } from "./deals/reference-documents.service";
import { TableFilterService } from "./datacomm/tableFilter.service";
import { ErrorMessage } from "./error.services";
import { CommonService } from "./common.service";

@Injectable({
    providedIn: "root"
})
export class FacadeService {

    constructor(private injector: Injector) { }

    // proposal starts
    private _proposalService: ProposalService;
    public get proposalService(): ProposalService {
        if (!this._proposalService) {
            this._proposalService = this.injector.get(ProposalService)
        }
        return this._proposalService;
    }

    getProposalList(payload) {
        return this.proposalService.proposals(payload);
    }

    createProposal(payload) {
        return this.proposalService.create(payload);
    }

    editProposal(payload) {
        return this.proposalService.editDocument(payload);
    }

    lockPorposal(payload) {
        return this.proposalService.lockDocument(payload);
    }

    deleteProposal(payload) {
        return this.proposalService.deleteProposal(payload);
    }

    proposalActionRedirect(payload) {
        return this.proposalService.proposalActionRedirect(payload);
    }

    uploadProposalDocument(payload) {
        return this.proposalService.uploadProposalTemplate(payload);
    }

    wittyMoveToNext(payload) {
        return this.proposalService.sectionMoveToNext(payload);
    }

    wittyMoveToDraft(payload) {
        return this.proposalService.sectionMoveToDraft(payload);
    }

    proposalChangeStatus(payload) {
        return this.proposalService.proposalStatusChange(payload);
    }

    getDealTechSolutionCacheData() {
        return this.proposalService.getDealTechSolutionCacheData();
    }
    // .proposal

    // deal role
    private _dealRoleService: DealRoleService;
    public get dealRoleService(): DealRoleService {
        if (!this._dealRoleService) {
            this._dealRoleService = this.injector.get(DealRoleService)
        }
        return this._dealRoleService;
    }

    setRole(payload) {
        return this.dealRoleService.setRole(payload);
    }

    dealOwner() {
        return this.dealRoleService.dealOwner;
    }

    dealTeam() {
        return this.dealRoleService.dealTeam;
    }

    moduleOwner() {
        return this.dealRoleService.moduleOwner;
    }

    moduleTeam() {
        return this.dealRoleService.moduleTeam;
    }
    // .deal role

    // reference documents
    private _referenceDocumentService: ReferenceDocumentService;
    public get referenceDocumentService(): ReferenceDocumentService {
        if (!this._referenceDocumentService) {
            this._referenceDocumentService = this.injector.get(ReferenceDocumentService)
        }
        return this._referenceDocumentService;
    }

    getRefDocList(payload) {
        return this.referenceDocumentService.listFolder(payload);
    }

    createRefDocFolder(payload) {
        return this.referenceDocumentService.createFolder(payload);
    }

    deleteRefDoc(payload) {
        return this.referenceDocumentService.deleteFolders(payload);
    }

    editRefDoc(payload) {
        return this.referenceDocumentService.editFolder(payload);
    }

    moveRefDoc(payload) {
        return this.referenceDocumentService.moveFiles(payload);
    }
    // .reference documents

    // table filter documents
    private _tableFilterService: TableFilterService;
    public get tableFilterService(): TableFilterService {
        if (!this._tableFilterService) {
            this._tableFilterService = this.injector.get(TableFilterService)
        }
        return this._tableFilterService;
    }

    filterHeaderValue(filterData, uiMappedArrObj) {
        return this.tableFilterService.getUniqueHeaderValue(filterData, uiMappedArrObj)
    }
    // .table filter documents

    // error
    private _error: ErrorMessage;
    public get error(): ErrorMessage {
        if (!this._error) {
            this._error = this.injector.get(ErrorMessage)
        }
        return this._error;
    }

    errMsg(message) {
        return this.error.throwError(message)
    }
    // .error 

     // common service
     private _commonService: CommonService;
     public get commonService(): CommonService {
         if (!this._commonService) {
             this._commonService = this.injector.get(CommonService)
         }
         return this._commonService;
     }
 
     back() {
         return this.commonService.goBack();
     }

     routingUrl() {
         return this.commonService.loadRouting();
     }
     routerData() {
         return this.commonService.getDataFromRouter();
     }
     // .error 

}