import { Injectable } from "@angular/core";
import { OnlineOfflineService } from "../../online-offline.service";
import { OfflineService } from "../../offline.services";
import { EncrDecrService } from "../../encr-decr.service";

@Injectable({ providedIn: 'root' })
export class LeadListOfflineService {
  private db: any;

  public readonly LeadTableIdentity = {
    MyOpenLead: 1,
    OpenLead: 2,
    ArchivedLead: 3
  }
  constructor(private readonly onlineOfflineService: OnlineOfflineService,private encService: EncrDecrService, private offlineService: OfflineService) {
    this.db = this.offlineService.dbOperation
  }

  async addLeadListCacheData(type: string, data, count: number, link: string, leadType: number) {
    this.db.open().catch(function (e) {
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      nextlink: null
    }
    console.log(Obj)
    if (type == "Table") {
      Obj.id = leadType,
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = this.offlineService.EncryptOfflineData(data)
      Obj.nextlink = link
      this.storeLeadListIndexDbData(Obj)
    }
  }
  async getLeadListIndexCacheData(key) {
    try {
      const data = await this.db.lead.toArray()
      console.log("seeing the lead encrypyet data")
      console.log(data)
       return data.filter(x => x.id == key)
    } catch (error) {
      return []
    }
  }
  async storeLeadListIndexDbData(data) {

    this.db.transaction('rw', this.db.lead, function () {
      this.db.lead.add( data );
    }).catch(function (e) {

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

  async ClearEntireLeadIndexTableData() {
    try {
      await this.db.lead.clear()
      return true
    } catch (error) {
      return false
    }
  }


}

