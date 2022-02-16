import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";
import { UploadList } from "../../state.models/deals/upload-rls.interface";

export interface UploadRLSListState {
    uploadRLSList: UploadList
}
export const InitialState: UploadRLSListState = {
    uploadRLSList: {
        "ModuleNumber": "",
        "ModuleStatus": "",
        "ModuleName": "",
        "ModuleOwner": "",
        "PricingCategory": "",
        "TypeofDeal": "",
        "SubmissionDate": "",
        "ModuleBFM": "",
        "RateInflationStartQuarter": "",
        "RateInflationInterval": "",
        "CostInflationStartQuarter": "",
        "CostInflationInterval": "",
        "ModuleVersion": "",
        "DealHeaderID": "",
        "ModuleID": "",
        "ModuleOwnerEmailID": "",
        "DealTeamEmailID": "",
        "ModuleTeamEmailID": "",
        "expanded": false,
        "panelOpenState": false,
        "RLSList": [
            {
            "RLSId": "",
            "RLSNumber": "",
            "RLSName": "",
            "RLSStatus": "",
            "RLSVersion": "",
            "RLSStatusCode": "",
            "RLSType": "",
            "isRLSUploadEnabled": "",
            "isRevertEnabled": "",
            "isDeleteRLSEnabled": ""
          }
        ]
    }
};
export function UploadRLSListReducer(state = InitialState, action: DealsActions): UploadRLSListState {
    switch (action.type) {
        case DealsActionTypes.UploadRLS:
            return {
                uploadRLSList: action.payload.uploadRLSList
            }
        default: {
            return state
        }
    }
}