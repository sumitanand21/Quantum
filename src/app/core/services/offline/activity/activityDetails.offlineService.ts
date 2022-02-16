import { Injectable } from "@angular/core";
import { OnlineOfflineService } from "../../online-offline.service";
import { OfflineService } from "../../offline.services";
import { EncrDecrService } from "../../encr-decr.service";

@Injectable({ providedIn: 'root' })
export class ActivityDetailsOfflineService {
  private db: any;


  constructor(private readonly onlineOfflineService: OnlineOfflineService, private encService: EncrDecrService, private offlineService: OfflineService) {
    this.db = this.offlineService.dbOperation
  }

  async addActivityDetailsCacheData(type: string, data, id: any) {
    this.db.open().catch(function (e) {
    })
    let Obj = {
      id: null,
      type: null,
      data: null
    }
    console.log(Obj)
    if (type == "Details") {
      Obj.id = this.offlineService.EncryptOfflineData(id),
        Obj.type = type,
        Obj.data = this.offlineService.EncryptOfflineData(data)

      this.storeActivityDetailsIndexDbData(Obj)
    }
  }
  async getActivityDetailsindexCacheData(key) {
    try {
      const data = await this.db.activitydetails.toArray()
      console.log("seeing the lead encrypyet data")
      console.log(data)
      return data.filter(x => x.id == this.offlineService.EncryptOfflineData(key))
    } catch (error) {
      return []
    }
  }
  async storeActivityDetailsIndexDbData(data) {

    this.db.transaction('rw', this.db.activitydetails, function () {
      this.db.activitydetails.add(data);
    }).catch(function (e) {

    })
  }
  async ClearActivityDetailsIndexDbData(id) {
    try {
      await this.db.activitydetails.delete(this.offlineService.EncryptOfflineData(id))
      return true
    } catch (error) {
      return false
    }
  }

  async ClearEntireActivityDetailsData() {
    try {
      await this.db.activitydetails.clear()
      return true
    } catch (error) {
      return false
    }
  }


}

