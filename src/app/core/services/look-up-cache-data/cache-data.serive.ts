import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class CacheDataService {
    cacheData = {
        "activityGroup": [],
        "customerParticipants": [],
        "wiproParticipants": [],
        "potentialWiproSolutions": [],
        "linkedCampaigns": [],
        "linkedLeads": [],
        "linkedOpportunitiesOrder": [],
        "linkedMarketingTraining": [],
        "actionOwner": [],
        "meetingSubject": [],
        "accountCompanyName": [],
        "sbu": [],
        "verticalList": [],
        "interest": [],
        "function": [],
        "myActivityListData" : [],
        "contactAccountname": [],
        "contactReportingManager": [],
        "contactCBU": [],
        "contactCountry": [],
        "contactState": [],
        "contactCity": [],
        "contactInterest": [],
        "contactReferenceType": [],
        "advisorAcc":[],
        "accountCompany":[],
        "prospectVertical" : [],
        "prospectGeo" : [],
        "prospectRegion" : [],
        "prospectCountry" : [],
        "prospectState" : [],
        "prospectCity" : [],
    }
    constructor() { }

    cacheDataSet(key, value) {
        this.cacheData[key] = value
        console.log("Cache data", JSON.stringify(this.cacheData))
    }

    cacheDataGet(key) {
        return this.cacheData[key]
    }

    cacheDataReset(key) {
        this.cacheData[key] = []
    }

    cacheDataMultiReset(keyValue) {
        keyValue.forEach(key => {
            this.cacheData[key] = []
        });
        console.log("Cache reset multiple",this.cacheData)
    }
}