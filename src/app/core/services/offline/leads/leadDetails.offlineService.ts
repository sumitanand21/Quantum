import { Injectable } from "@angular/core";
import { OnlineOfflineService } from "../../online-offline.service";
import { OfflineService } from "../../offline.services";

@Injectable({ providedIn: 'root' })
export class LeadDetailsOfflineService {
  private db: any;

  public readonly LeadTableIdentity = {
    MyOpenLead: 1,
    OpenLead: 2,
    ArchivedLead: 3
}
  constructor(private readonly onlineOfflineService: OnlineOfflineService,private offlineService:OfflineService) {
        this.db=this.offlineService.dbOperation
  }

  async addLeadListCacheData(type: string, data, count: number, link: string,leadType:number) {
      console.log("insidde yhasd add myopen leadscache dadta!!!!!!!!)")
    console.log("**************************************** offlione myleads")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    console.log("*************")
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      nextlink: null
    }
    console.log(Obj)
    if (type == "Table") {
      console.log("tyes we have table data !!@!212")
      Obj.id = leadType,
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeLeadListIndexDbData(Obj)
    } 
  }
  async getLeadListIndexCacheData(key) {
    try {
      const data = await this.db.lead.toArray()
      return data.filter(x => x.id == key)
    } catch (error) {
      return []
    }
  }
  async storeLeadListIndexDbData(data) {
    console.log("inside the stiore acitivioyt db data")
    console.log(data)
    this.db.transaction('rw', this.db.lead, function () {
      this.db.lead.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async ClearLeadListIndexTableData(leadType) {
    try {
      await this.db.lead.delete(leadType)
      return true
    } catch (error) {
      return false
    }
  }
}