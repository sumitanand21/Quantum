import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Dexie from 'dexie';
import { OnlineOfflineService } from './online-offline.service';
import { EncrDecrService } from './encr-decr.service';
declare const window: any;
import { environment as env } from '@env/environment';
import { EnvService } from './env.service';
@Injectable({ providedIn: 'root' })

export class OfflineService {
  private db: any;
  constructor(
    private readonly onlineOfflineService: OnlineOfflineService, 
    private encService: EncrDecrService,public envr : EnvService) {
    this.createDatabase();
  }

  //--------------------------------------Create Db schema----------------------------------------------
  createDatabase() {
    // console.log(parent)
    this.db = new Dexie("L2o");
    this.db.version(1).stores({
      activity: "&++id,count,type, data",
      lead: "&++id,count,type, data",
      myactivity: "&++id,count,type, data",
      home: "&++id,count,type, data",
      conversation: "&++id,count,type, data",
      childconversation: "&++id,SysGuid,type,data,count",
      meetinglist: "&++id,type,data,count",
      actionlist: "&++id,type,data,count",
      archived: "&++id,count,type, data",
      convdetails: "&++id,parentId,type,data",
      allcampaign: "&++id, type,count, data",
      completedcampaign: "&++id, type, data",
      activecampaign: "&++id, type, data",
      actionconversation: "&++id, type, count,data",
      actconversatiodetail: "&++id,type,data",
      masterdata: "&++id,data",
      myconversation: "&++id,count,type, data",
      contact: "&++id, count ,type , data",
      deActivatedcontact: "&++id, count ,type , data",
      contactDetails: "&++id,count,type, data",
      marketDetails: "&++id,count,type, data",
      activitydetails: "&++id,type,data",
      // marketInfoDetails: "&++id,parentId,type, data",
      otherActivity: "&++id,count,type, data",
      task: "&++id,count,type, data",
      approval: "&++id,count,type, data",
      relationshipDetail: "&++id,count,type, data",
      uploadRLS: "&++id,type,data,count",
      ExisitingDeals: "&++id,type,data",
      TaggedDeals: "&++id,type,data",
      DealOverview: "&++id,type,data",
      calculate: "&++id,type,data",
      dealTechSolution: "&++id,type,data",
      createActionList: "&++id,type,data,count",
      rlsList: "&++id,type,data,count",
      modulesAllList: "&++id,type,data",
      milestoneList:"&++id,type,data",
      calenderList:"&++id,type,data",
      attachDocument: "&++id,type,data",
      dealparams:'&++id,type,data',
    });
  }

  get dbOperation() {
    return this.db
  }

  EncryptOfflineData(data) {
    let token = localStorage.getItem('token').toString()
    return this.encService.set(token.substring(0, 32), JSON.stringify(data), this.envr.encDecConfig.key);
  }

  DecryptOfflineData(data) {
    let token = localStorage.getItem('token').toString()
    return JSON.parse(this.encService.get(token.substring(0, 32), data, this.envr.encDecConfig.key))
  }
  // -----------------------------------------Conversation Functions starts--------------------------------------------------------------
  async addConversationCacheData(type: string, data, count: number, link: string) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      nextlink: null
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeConvTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeConvTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeConvTypeOfIndexDbData(Obj)
    }
  }
  async getConversationTableIndexCacheData() {
    try {
      const data = await this.db.conversation.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeConvTypeOfIndexDbData(data) {
    this.db.transaction('rw', this.db.conversation, function () {
      this.db.conversation.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async ClearConvIndexTableData() {
    try {
      await this.db.conversation.clear()
      return true
    } catch (error) {
      return false
    }
  }


  //--------------------------------------- Contact details page -----------------------------------------------
  async addContactDetailsCacheData(type: string, data, RequestChildId: any) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null
    }
    if (type == "Details") {
      Obj.id = RequestChildId
      Obj.type = type,
        Obj.data = data
      this.storeContactDetailTypeOfIndexDbData(Obj)
    }
  }
  async storeContactDetailTypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.contactDetails, function () {
      this.db.contactDetails.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getContactDetailsData(Req) {
    console.log("seeing te requesred parent id")
    console.log(Req)
    console.log(Req.ParentId)
    try {
      const data = await this.db.contactDetails.toArray()
      console.log("got datat is")
      console.log(data)
      return data.filter(x => x.id == Req.ParentId)
    } catch (error) {
      return []
    }
  }
  async getContactDetailsType(Req: number) {
    try {
      const data = await this.db.contactDetails.toArray()
      return data.filter(x => x.id == Req)
    } catch (error) {
      return []
    }
  }
  async ClearContactDetailsIndexTableData() {
    try {
      await this.db.contactDetails.clear()
      return true
    } catch (error) {
      return false
    }
  }

  //--------------------------------------- Market details page -----------------------------------------------
  async addMarketDetailsCacheData(type: string, data, RequestChildId: any) {
    console.log("insid market details indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null
    }
    if (type == "Table") {
      Obj.id = data.CurrentPageNumber,
        Obj.type = type,
        Obj.data = data
      this.storeRelationshipDetailTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = RequestChildId
      Obj.type = type,
        Obj.data = data
      this.storeMarketDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeMarketDetailTypeOfIndexDbData(Obj)
    } else if (type == "MeetingTypes") {
      Obj.id = RequestChildId,
        Obj.type = type,
        Obj.data = data
      this.storeMarketDetailTypeOfIndexDbData(Obj)
    }
  }
  async storeMarketDetailTypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.marketDetails, function () {
      this.db.marketDetails.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getMarketDetailsData(Req) {
    console.log("seeing te requesred parent id")
    console.log(Req)
    console.log(Req.ParentId)
    try {
      const data = await this.db.marketDetails.toArray()
      console.log("got datat is")
      console.log(data)
      return data.filter(x => x.id == Req.ParentId)
    } catch (error) {
      return []
    }
  }
  async getMarketDetailsType(Req: number) {
    try {
      const data = await this.db.marketDetails.toArray()
      return data.filter(x => x.id == Req)
    } catch (error) {
      return []
    }
  }
  async ClearMarketDetailsIndexTableData() {
    try {
      await this.db.marketDetails.clear()
      return true
    } catch (error) {
      return false
    }
  }

  // -----------------------------------------Relationship Log Page --------------------------------------------------------------
  async addRelationshipLogCacheData(type: string, data, RequestChildId: number) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null
    }
    if (type == "Table") {
      Obj.id = data.CurrentPageNumber,
        Obj.type = type,
        Obj.data = data
      this.storeRelationshipDetailTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = RequestChildId
      Obj.type = type,
        Obj.data = data
      this.storeRelationshipDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeRelationshipDetailTypeOfIndexDbData(Obj)
    } else if (type == "MeetingTypes") {
      Obj.id = RequestChildId,
        Obj.type = type,
        Obj.data = data
      this.storeRelationshipDetailTypeOfIndexDbData(Obj)
    }
  }
  async storeRelationshipDetailTypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.relationshipDetail, function () {
      this.db.relationshipDetail.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getRelationshipDetailsData(Req) {
    console.log("seeing te requesred parent id")
    console.log(Req)
    console.log(Req.ParentId)
    try {
      const data = await this.db.relationshipDetail.toArray()
      console.log("got datat is")
      console.log(data)
      return data.filter(x => x.id == Req.ParentId)
    } catch (error) {
      return []
    }
  }
  async getRelationshipDetailsType(Req: number) {
    try {
      const data = await this.db.relationshipDetail.toArray()
      return data.filter(x => x.id == Req)
    } catch (error) {
      return []
    }
  }
  async ClearRelationDetailsIndexTableData() {
    try {
      await this.db.relationshipDetail.clear()
      return true
    } catch (error) {
      return false
    }
  }

  //-------------------------------------------My Conversation Function starts ---------------------------------------------------------------
  async addMyConversationCacheData(type: string, data, count: number, link: string) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      nextlink: null
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeMyConvTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeMyConvTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeMyConvTypeOfIndexDbData(Obj)
    }
  }
  async getMyConversationTableIndexCacheData() {
    try {
      const data = await this.db.myconversation.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeMyConvTypeOfIndexDbData(data) {
    this.db.transaction('rw', this.db.myconversation, function () {
      this.db.myconversation.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async ClearMyConvIndexTableData() {
    try {
      await this.db.myconversation.clear()
      return true
    } catch (error) {
      return false
    }
  }
  // -----------------------------------------Child Conversation Functions starts--------------------------------------------------------------
  async addChildConversationCacheData(type: string, data, SysGuid: string, count: number) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      SysGuid: null,
      type: null,
      data: null,
      count: null
    }
    if (type == "Table") {
      Obj.id = SysGuid,
        Obj.SysGuid = SysGuid
      Obj.type = type,
        Obj.data = data
      Obj.count = Number(count)
      this.storeChildConvTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      Obj.count = null
      this.storeChildConvTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = null
      this.storeChildConvTypeOfIndexDbData(Obj)
    }
  }
  async storeChildConvTypeOfIndexDbData(data) {
    this.db.transaction('rw', this.db.childconversation, function () {
      this.db.childconversation.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getChildConvTableIndexCacheData(data) {
    console.log("getiig this child data")
    console.log(data)
    try {
      const res = await this.db.childconversation.toArray()
      return res.filter(x => x.SysGuid == data.Conversation_Guid)
    } catch (error) {
      return []
    }
  }
  async ClearChildConvIndexTableData() {
    try {
      await this.db.childconversation.clear()
      return true
    } catch (error) {
      return false
    }
  }
  async ClearChildConvPrimarykey(primarykey) {
    console.log("inside delete child wtr to primary key")
    console.log(primarykey)
    try {
      const respo = await this.db.childconversation.delete(primarykey)
      console.log(respo)
      return true
    } catch (error) {
      return false
    }
  }
  //------------------------------------Archived functions starts -------------------------------------------------------------------------------------------------
  async addArchivedCacheData(type: string, data, count, link: string) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      link: ""
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data
      Obj.count = Number(count)
      Obj.link = link
      this.storeArchTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = ""
      Obj.link = ""
      this.storeArchTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = ""
      Obj.link = ""
      this.storeArchTypeOfIndexDbData(Obj)
    }
  }
  async getArchivedTableIndexCacheData() {
    try {
      const data = await this.db.archived.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeArchTypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.archived, function () {
      this.db.archived.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async ClearArchivedConvIndexTableData() {
    try {
      await this.db.archived.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //------------------------------------Delete / CLEAR Full IndexDb---------------------------------------------------------------------------------------------
  async ClearindexDb(flag: boolean) {
    if (flag == true) {
      this.db.delete();
      // Static method
      Dexie.delete('L2o');
    }
  }
  async ClearTablesdata(flag: boolean) {
    console.log("clearing teh table index999999999998888888888888")
    if (flag == true) {
      try {
        await this.ClearChildConvIndexTableData()
        await this.ClearConvIndexTableData()
        await this.ClearArchivedConvIndexTableData()
        await this.ClearCampaignIndexTableData()
        await this.ClearCompletedCampaignIndexTableData()
        await this.ClearActiveCampaignIndexTableData()
        await this.ClearActConvDetailsIndexTableData()
        await this.ClearActionConvIndexTableData()
        await this.ClearConvDetailsIndexTableData()
        await this.ClearTaskListIndexTableData()
        await this.ClearApprovalListIndexTableData()
        await this.ClearContactDetailsIndexTableData()
        await this.ClearUploadRLSIndexTableData()
        await this.ClearExistingDealsData()
        await this.ClearTaggedDealsData()
        await this.ClearDealoverviewData()
        await this.ClearCalculateIndexTableData()
        await this.ClearDealTechSolutionIndexTableData()
        await this.ClearRLSListTableData()
        await this.ClearModuleListTableData()
        await this.ClearMilestoneListTableData()
        await this.ClearCalenderListTableData()
        await this.ClearActionListTableData()
        await this.ClearAttachDocumentIndexTableData()
        return true
      } catch (error) {
        return false
      }
    }
  }
  async ClearCampaignTableData(flag: boolean) {
    if (flag == true) {
      try {
        await this.ClearCampaignIndexTableData()
        await this.ClearCompletedCampaignIndexTableData()
        await this.ClearActiveCampaignIndexTableData()
        return true
      } catch {
        return false
      }
    }
  }
  //-----------------------------------Conversation Details funtions starts---------------------------------------------------------------------------------------------
  async addConverDetailsCacheData(type: string, data, RequestChildId: number) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null
    }
    if (type == "Table") {
      Obj.id = data.CurrentPageNumber,
        Obj.type = type,
        Obj.data = data
      this.storeConvDetailTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = RequestChildId
      Obj.type = type,
        Obj.data = data
      this.storeConvDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeConvDetailTypeOfIndexDbData(Obj)
    } else if (type == "MeetingTypes") {
      Obj.id = RequestChildId,
        Obj.type = type,
        Obj.data = data
      this.storeConvDetailTypeOfIndexDbData(Obj)
    }
  }
  async storeConvDetailTypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.convdetails, function () {
      this.db.convdetails.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getConverastionDetailsData(Req) {
    console.log("seeing te requesred parent id")
    console.log(Req)
    console.log(Req.ParentId)
    try {
      const data = await this.db.convdetails.toArray()
      console.log("got datat is")
      console.log(data)
      return data.filter(x => x.id == Req.ParentId)
    } catch (error) {
      return []
    }
  }
  async getConverastionDetailsType(Req: number) {
    try {
      const data = await this.db.convdetails.toArray()
      return data.filter(x => x.id == Req)
    } catch (error) {
      return []
    }
  }
  async ClearConvDetailsIndexTableData() {
    try {
      await this.db.convdetails.clear()
      return true
    } catch (error) {
      return false
    }
  }


  //------------------------------------All Campain funtions starts---------------------------------------------------------------------------------------------
  async addAllCampaignCacheData(type: string, data, count) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.count = Number(count),
        Obj.data = data
      this.storeCampaignDetailTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeCampaignDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeCampaignDetailTypeOfIndexDbData(Obj)
    }
  }
  async storeCampaignDetailTypeOfIndexDbData(data) {
    console.log("adding this dfata")
    console.log(data)
    await this.db.transaction('rw', this.db.allcampaign, function () {
      this.db.allcampaign.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getAllCampaignDetailsData() {
    console.log("campaingn  seeing te requesred parent id")
    // console.log(Pageno)
    // console.log(Pageno)
    try {
      const data = await this.db.allcampaign.toArray()
      console.log("got datat is")
      console.log(data)
      return data
    } catch (error) {
      return []
    }
  }
  async ClearCampaignIndexTableData() {
    try {
      await this.db.allcampaign.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //------------------------------------All Completed Campaign funtions starts---------------------------------------------------------------------------------------------
  // 
  async addCompletedCampaignCacheData(type: string, data, count) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data,
        Obj.count = Number(count)
      this.storeCompletedCampaignDetailTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.data = data,
        Obj.count = ""
      this.storeCompletedCampaignDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = ""
      this.storeCompletedCampaignDetailTypeOfIndexDbData(Obj)
    }
  }
  async storeCompletedCampaignDetailTypeOfIndexDbData(data) {
    console.log("adding this dfata")
    console.log(data)
    await this.db.transaction('rw', this.db.completedcampaign, function () {
      this.db.completedcampaign.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getAllCompletedCampaignDetailsData() {
    console.log("campaingn  seeing te requesred parent id")
    try {
      const data = await this.db.completedcampaign.toArray()
      console.log("got datat is")
      console.log(data)
      return data
    } catch (error) {
      return []
    }
  }
  async ClearCompletedCampaignIndexTableData() {
    try {
      await this.db.completedcampaign.clear()
      return true
    } catch (error) {
      return false
    }
  }
  // -----------------------------------------Action Conversation Functions starts--------------------------------------------------------------
  async addActionConversationCacheData(type: string, data, SysGuid: string, count: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      SysGuid: null,
      type: null,
      count: null,
      data: null
    }
    if (type == "Table") {
      Obj.id = SysGuid,
        Obj.SysGuid = SysGuid
      Obj.type = type,
        Obj.data = data,
        Obj.count = Number(count)
      this.storeActionConvTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = ""
      this.storeActionConvTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = ""
      this.storeChildConvTypeOfIndexDbData(Obj)
    }
  }
  async storeActionConvTypeOfIndexDbData(data) {
    this.db.transaction('rw', this.db.actionconversation, function () {
      this.db.actionconversation.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getActionConvTableIndexCacheData(data) {
    try {
      const res = await this.db.actionconversation.toArray()
      return res.filter(x => x.SysGuid == data.ParentId)
    } catch (error) {
      return []
    }
  }
  async ClearActionConvIndexTableData() {
    try {
      await this.db.actionconversation.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //------------------------------------Conversation Action Details funtions starts---------------------------------------------------------------------------------------------
  async addActConvDetailsCacheData(type: string, data, ActivityId: number) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null
    }
    if (type == "Table") {
      Obj.id = data.CurrentPageNumber,
        Obj.type = type,
        Obj.data = data
      this.storeActConvDetailTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = ActivityId
      Obj.type = type,
        Obj.data = data
      this.storeActConvDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeActConvDetailTypeOfIndexDbData(Obj)
    } else if (type == "MeetingTypes") {
      Obj.id = ActivityId,
        Obj.type = type,
        Obj.data = data
      this.storeActConvDetailTypeOfIndexDbData(Obj)
    }
  }
  async storeActConvDetailTypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.actconversatiodetail, function () {
      this.db.actconversatiodetail.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getActConverastionDetailsData(Req) {
    console.log("seeing te requesred parent id")
    console.log(Req)
    console.log(Req.ActivityId)
    try {
      const data = await this.db.actconversatiodetail.toArray()
      console.log("got datat is")
      console.log(data)
      return data.filter(x => x.id == Req.ActivityId)
    } catch (error) {
      return []
    }
  }
  async ClearActionConvPrimarykey(primarykey) {
    try {
      const respo = await this.db.actconversatiodetail.delete(primarykey)
      console.log(respo)
      return true
    } catch (error) {
      return false
    }
  }
  async ClearActConvDetailsIndexTableData() {
    try {
      await this.db.actconversatiodetail.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //------------------------------------All Active Campaign funtions starts---------------------------------------------------------------------------------------------
  // 
  async addActiveCampaignCacheData(type: string, data, count) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data,
        Obj.count = Number(count)
      this.storeActiveCampaignDetailTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.data = data,
        Obj.count = ""
      this.storeActiveCampaignDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = ""
      this.storeActiveCampaignDetailTypeOfIndexDbData(Obj)
    }
  }
  async storeActiveCampaignDetailTypeOfIndexDbData(data) {
    console.log("adding this dfata")
    console.log(data)
    await this.db.transaction('rw', this.db.activecampaign, function () {
      this.db.activecampaign.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getAllActiveCampaignDetailsData() {
    console.log("campaingn  seeing te requesred parent id")
    try {
      const data = await this.db.activecampaign.toArray()
      console.log("got datat is")
      console.log(data)
      return data
    } catch (error) {
      return []
    }
  }
  async ClearActiveCampaignIndexTableData() {
    try {
      await this.db.activecampaign.clear()
      return true
    } catch (error) {
      return false
    }
  }

  //----------------------------------------------------Contacts List starts--------------------------------------------------------------------------------------------------------------
  async addContactsCacheData(type: string, data, count, OdatanextLink) {
    console.log("inside the contacts indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      OdatanextLink: null
    }
    if (type == "Table") {
      console.log('in table');
      Obj.id = 1,
        Obj.type = type,
        Obj.count = Number(count)
      Obj.data = data
      Obj.OdatanextLink = OdatanextLink
      this.storeContactsTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.count = '',
        Obj.data = data
      this.storeContactsTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.count = '',
        Obj.data = data
      this.storeContactsTypeOfIndexDbData(Obj)
    }
  }
  async storeContactsTypeOfIndexDbData(data) {
    console.log("adding contact data")
    console.log(data)
    await this.db.transaction('rw', this.db.contact, function () {
      this.db.contact.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getContactListData() {
    console.log("contact data from cache")
    try {
      const data = await this.db.contact.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async clearContactListData() {
    try {
      await this.db.contact.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //----------------------------------------------------Contacts List Ends------------------------------------------------------------------------------------------------------------------------


  
  //----------------------------------------------------DeActivated Contacts List starts--------------------------------------------------------------------------------------------------------------
  async addDeActivatedContactsCacheData(type: string, data, count, OdatanextLink) {
    console.log("inside the contacts indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      OdatanextLink: null
    }
    if (type == "Table") {
      console.log('in table');
      Obj.id = 1,
        Obj.type = type,
        Obj.count = Number(count)
      Obj.data = data
      Obj.OdatanextLink = OdatanextLink
      this.storeDeActivatedContactsTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.count = '',
        Obj.data = data
      this.storeDeActivatedContactsTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.count = '',
        Obj.data = data
      this.storeDeActivatedContactsTypeOfIndexDbData(Obj)
    }
  }
  async storeDeActivatedContactsTypeOfIndexDbData(data) {
    console.log("adding DeActivated contact data")
    console.log(data)
    await this.db.transaction('rw', this.db.deActivatedcontact, function () {
      this.db.deActivatedcontact.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async getDeActivatedContactListData() {
    console.log("DeActivated contact data from cache")
    try {
      const data = await this.db.deActivatedcontact.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async clearDeActivateContactListData() {
    try {
      await this.db.deActivatedcontact.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //----------------------------------------------------DeActivated Contacts List Ends------------------------------------------------------------------------------------------------------------------------




  //-----------------------------------------------------Master Api's Cache /offline -----------------------------------------------
  async addMasterApiCache(key, data) {
    console.log(key)
    console.log(data)
    let MasterObj = {
      id: key,
      data: data
    }
    await this.db.transaction('rw', this.db.masterdata, function () {
      this.db.masterdata.add(MasterObj);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
      return []
    })
  }
  async getMasterDataCache(key) {
    console.log("+++++++++++++++++++++++++++++++++++++++")
    console.log(key)
    try {
      // await db.people.where({
      // //   firstName: 'foo',
      // //   lastName: 'bar'
      // // }).first();
      const data = await this.db.masterdata.toArray()
      console.log("got master datat is")
      console.log(data)
      if (data) {
        if (data.length > 0) {
          return data.filter(x => x.id == key)[0]
        } else {
          return null
        }
      } else {
        return null
      }
    } catch (error) {
      console.log("got error in queriig the data!!1")
      console.log(error)
      return []
    }
  }
  async ClearMasterApiData() {
    try {
      await this.db.masterdata.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //------------------------------------------------All Activities offline services ----------------------------------------------------------
  async addActivityCacheData(type: string, data, count: number, link: string) {
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
      Obj.id = 1,
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeActivityIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeActivityIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeActivityIndexDbData(Obj)
    }
  }
  async getActivityIndexCacheData() {
    try {
      const data = await this.db.activity.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeActivityIndexDbData(data) {
    console.log("inside the stiore acitivioyt db data")
    console.log(data)
    this.db.transaction('rw', this.db.activity, function () {
      this.db.activity.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async ClearActivityIndexTableData() {
    try {
      await this.db.activity.clear()
      return true
    } catch (error) {
      return false
    }
  }
  // ------------------------------------------------------Home Offline Services --------------------------------------------------------
  async addHomeTaskCacheData(type: string, data, count: number, id: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
    }
    console.log(Obj)
    if (type == "Table") {
      console.log("tyes we have table data !!@!212")
      Obj.id = id,
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      /**
       * Obj id value 1 - Activities,
       *  Obj id value 2 - Task
       */
      this.storeActivityIndexDbData(Obj)
    }
  }
  async getHomeTaskListCacheData() {
    try {
      const data = await this.db.home.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeHomeTaskListIndexDbData(data) {
    console.log("inside the stiore acitivioyt db data")
    console.log(data)
    this.db.transaction('rw', this.db.home, function () {
      this.db.home.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async ClearHomeIndexTableData() {
    try {
      await this.db.home.clear()
      return true
    } catch (error) {
      return false
    }
  }


  //--------------------------------------------------------------My-Activity ----------------------------------------------------------------------------

  async addMyActivityCacheData(type: string, data, count: number, link: string) {
    this.db.open().catch(function (e) {

    })

    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      nextlink: null
    }

    if (type == "Table") {

      Obj.id = 1,
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeMyActivityIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeMyActivityIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeMyActivityIndexDbData(Obj)
    }
  }
  async getMyActivityIndexCacheData() {
    try {
      const data = await this.db.myactivity.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeMyActivityIndexDbData(data) {

    this.db.transaction('rw', this.db.myactivity, function () {
      this.db.myactivity.add(data);
    }).catch(function (e) {

    })
  }
  async ClearMyactivityIndexTableData() {
    try {
      await this.db.myactivity.clear()
      return true
    } catch (error) {
      return false
    }
  }

  // ------------------------------------------------------------Task-List---------------------------------------------------------------------

  async addTaskListCacheData(type: string, data, count: number, link: string) {
    this.db.open().catch(function (e) {

    })

    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      nextlink: null
    }

    if (type == "Table") {

      Obj.id = 1, // indication for this is a table date we are storing
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeTaskListIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeTaskListIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeTaskListIndexDbData(Obj)
    }
  }
  async getTaskListIndexCacheData() {
    try {
      const data = await this.db.task.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeTaskListIndexDbData(data) {

    this.db.transaction('rw', this.db.task, function () {
      this.db.task.add(data);
    }).catch(function (e) {

    })
  }
  async ClearTaskListIndexTableData() {
    try {
      await this.db.task.clear()
      return true
    } catch (error) {
      return false
    }
  }

  // -------------------------------------------------------------- Approval-List-----------------------------------------------------------------------
  async addApprovalListCacheData(type: string, data, count: number, link: string) {
    this.db.open().catch(function (e) {

    })

    let Obj = {
      id: null,

      type: null,
      count: null,
      data: null,
      nextlink: null
    }

    if (type == "Table") {

      Obj.id = 1, // indication for this is a table date we are storing
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeApprovalListIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeApprovalListIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeApprovalListIndexDbData(Obj)
    }
  }
  async getApprovalListIndexCacheData() {
    try {
      const data = await this.db.approval.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeApprovalListIndexDbData(data) {

    this.db.transaction('rw', this.db.approval, function () {
      this.db.approval.add(data);
    }).catch(function (e) {

    })
  }
  async ClearApprovalListIndexTableData() {
    try {
      await this.db.approval.clear()
      return true
    } catch (error) {
      return false
    }
  }


  // -----------------------------------------------Activity-Meeting-OfflineService --------------------------------------------------------------

  async getActivityMeetingById(activityGroupId) {

    try {
      const data = await this.db.meetinglist.toArray()
      return data.filter()
    } catch (error) {
      return []
    }

  }

  async addActivityMeetingListCacheData(type: string, data, count: number, link: string, ActivityGroupParentid) {
    this.db.open().catch(function (e) {

    })

    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      nextlink: null
    }

    if (type == "Table") {

      Obj.id = ActivityGroupParentid, // indication for this is a table date we are storing
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeActivityMeetingListIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeActivityMeetingListIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeActivityMeetingListIndexDbData(Obj)
    }
  }

  async storeActivityMeetingListIndexDbData(data) {

    this.db.transaction('rw', this.db.meetinglist, function () {
      this.db.meetinglist.add(data);
    }).catch(function (e) {

    })
  }
  async ClearActivityMeetingListIndexTableDataById(parentId) {
    try {
      await this.db.meetinglist.delete(parentId)
      return true
    } catch (error) {
      return false
    }
  }

  //----------------------------------Activity Actions Listing---------------------------------------------------------------------------------------------------

  async getActivityActionById(activityGroupId) {
    console.log(activityGroupId)
    try {
      const data = await this.db.actionlist.toArray()
      console.log('data', data)
      return data.filter()
    } catch (error) {
      return []
    }

  }

  async addActivityActionListCacheData(type: string, data: any, count: number, link: string, ActivityGroupParentid) {
    this.db.open().catch(function (e) {

    })

    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      nextlink: null
    }

    if (type == "Table") {

      Obj.id = ActivityGroupParentid, // indication for this is a table date we are storing
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeActivityActionListIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeActivityActionListIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeActivityActionListIndexDbData(Obj)
    }
  }

  async storeActivityActionListIndexDbData(data) {
    console.log('Data stored--->', data)
    this.db.transaction('rw', this.db.actionlist, function () {
      this.db.actionlist.add(data);
    }).catch(function (e) {

    })
  }
  async ClearActivityActionListIndexTableDataById(parentId) {
    try {
      await this.db.actionlist.delete(parentId)
      return true
    } catch (error) {
      return false
    }
  }

  //-------------------------------------------Other Activity Function starts ---------------------------------------------------------------
  async getOtherActivityById(otherActivityGroupId) {
    try {
      const data = await this.db.otherActivity.toArray()
      return data.filter()
    } catch (error) {
      return []
    }
  }

  async addOtherActivityCacheData(type: string, data, count: number, link: string, otherActivityGroupParentid) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null,
      nextlink: null
    }
    if (type == "Table") {
      Obj.id = otherActivityGroupParentid,
        Obj.count = Number(count)
      Obj.type = type,
        Obj.data = data
      Obj.nextlink = link
      this.storeOtherActivityTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeOtherActivityTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeOtherActivityTypeOfIndexDbData(Obj)
    }
  }
  async getOtherActivityTableIndexCacheData() {
    try {
      const data = await this.db.otherActivity.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeOtherActivityTypeOfIndexDbData(data) {
    this.db.transaction('rw', this.db.otherActivity, function () {
      this.db.otherActivity.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })
  }
  async ClearOtherActivityIndexTableDataByParentId(parentId) {
    try {
      await this.db.otherActivity.delete(parentId)
      return true
    } catch (error) {
      return false
    }
  }
  /* account module changes starts here*/
  async getActiveAccountDetailsData() {
    console.log("activeaccount seeing te requesred parent id")
    // console.log(Pageno)
    // console.log(Pageno)
    try {
      const data = await this.db.activeaccounts.toArray()
      console.log("got datat is")
      console.log(data)
      return data
    } catch (error) {
      return []
    }

  }
  async getAllianceAccountDetailsData() {
    console.log("activeaccount seeing te requesred parent id")
    // console.log(Pageno)
    // console.log(Pageno)
    try {
      const data = await this.db.allianceaccount.toArray()
      console.log("got datat is")
      console.log(data)
      return data
    } catch (error) {
      return []
    }

  }
  async ClearAllianceAccountIndexTableData() {
    try {
      await this.db.allianceaccount.clear()
      return true
    } catch (error) {
      return false
    }
  }
  async getReserveAccountDetailsData() {
    console.log("activeaccount seeing te requesred parent id")
    // console.log(Pageno)
    // console.log(Pageno)
    try {
      const data = await this.db.reserveaccount.toArray()
      console.log("got datat is")
      console.log(data)
      return data
    } catch (error) {
      return []
    }

  }
  async ClearReserveAccountIndexTableData() {
    try {
      await this.db.reserveaccount.clear()
      return true
    } catch (error) {
      return false
    }
  }
  async getCreationHistoryDetailsData() {
    console.log("activeaccount seeing te requesred parent id")
    // console.log(Pageno)
    // console.log(Pageno)
    try {
      const data = await this.db.creationhistory.toArray()
      console.log("got datat is")
      console.log(data)
      return data
    } catch (error) {
      return []
    }

  }
  async ClearCreationHistoryIndexTableData() {
    try {
      await this.db.creationhistory.clear()
      return true
    } catch (error) {
      return false
    }
  }
  async getActiveRequestsDetailsData() {
    console.log("activeaccount seeing te requesred parent id")
    // console.log(Pageno)
    // console.log(Pageno)
    try {
      const data = await this.db.activerequests.toArray()
      console.log("got datat is")
      console.log(data)
      return data
    } catch (error) {
      return []
    }

  }
  async ClearActiveRequestsIndexTableData() {
    try {
      await this.db.activerequests.clear()
      return true
    } catch (error) {
      return false
    }
  }
  async ClearActiveAccountIndexTableData() {
    try {
      await this.db.activeaccounts.clear()
      return true
    } catch (error) {
      return false
    }
  }
  async addActiveAccountCacheData(type: string, data, count) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })

    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null
    }
    if (type == "Table") {

      Obj.id = 1,
        Obj.type = type,
        Obj.count = Number(count),
        Obj.data = data

      this.storeActiveAccountDetailTypeOfIndexDbData(Obj)

    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeActiveAccountDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeActiveAccountDetailTypeOfIndexDbData(Obj)
    }

  }
  async storeActiveAccountDetailTypeOfIndexDbData(data) {
    console.log("adding this dfata")
    console.log(data)
    // debugger;
    await this.db.transaction('rw', this.db.activeaccount, function () {
      this.db.activeaccount.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })

  }
  async addAllianceAccountCacheData(type: string, data, count) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })

    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null
    }
    if (type == "Table") {

      Obj.id = 1,
        Obj.type = type,
        Obj.count = Number(count),
        Obj.data = data

      this.storeAllianceAccountDetailTypeOfIndexDbData(Obj)

    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeAllianceAccountDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeAllianceAccountDetailTypeOfIndexDbData(Obj)
    }

  }
  async storeAllianceAccountDetailTypeOfIndexDbData(data) {
    console.log("adding this dfata")
    console.log(data)

    await this.db.transaction('rw', this.db.allianceaccount, function () {
      this.db.allianceaccount.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })

  }
  async addReserveAccountCacheData(type: string, data, count) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })

    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null
    }
    if (type == "Table") {

      Obj.id = 1,
        Obj.type = type,
        Obj.count = Number(count),
        Obj.data = data

      this.storeReserveAccountDetailTypeOfIndexDbData(Obj)

    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeReserveAccountDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeReserveAccountDetailTypeOfIndexDbData(Obj)
    }

  }
  async storeReserveAccountDetailTypeOfIndexDbData(data) {
    console.log("adding this dfata")
    console.log(data)

    await this.db.transaction('rw', this.db.reserveaccount, function () {
      this.db.reserveaccount.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })

  }
  async addCreationHistorytCacheData(type: string, data, count) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })

    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null
    }
    if (type == "Table") {

      Obj.id = 1,
        Obj.type = type,
        Obj.count = Number(count),
        Obj.data = data

      this.storeCreationHistoryDetailTypeOfIndexDbData(Obj)

    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeCreationHistoryDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeCreationHistoryDetailTypeOfIndexDbData(Obj)
    }

  }
  async storeCreationHistoryDetailTypeOfIndexDbData(data) {
    console.log("adding this dfata")
    console.log(data)

    await this.db.transaction('rw', this.db.creationhistory, function () {
      this.db.creationhistory.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })

  }
  async addActiveRequestsCacheData(type: string, data, count) {
    console.log("insid ethe add conversation indexdb")
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })

    let Obj = {
      id: null,
      type: null,
      count: null,
      data: null
    }
    if (type == "Table") {

      Obj.id = 1,
        Obj.type = type,
        Obj.count = Number(count),
        Obj.data = data

      this.storeActiveRequestsDetailTypeOfIndexDbData(Obj)

    } else if (type == "Details") {
      Obj.id = Math.random()
      Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeActiveRequestsDetailTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.count = "",
        Obj.data = data
      this.storeActiveRequestsDetailTypeOfIndexDbData(Obj)
    }

  }
  async storeActiveRequestsDetailTypeOfIndexDbData(data) {
    console.log("adding this dfata")
    console.log(data)

    await this.db.transaction('rw', this.db.activerequests, function () {
      this.db.activerequests.add(data);
    }).catch(function (e) {
      console.log("GOT ERROR IN ADDING THE INDEXDB STORE")
      console.log(e)
    })

  }

  /* account module changes ends here*/

  //----------------------------------------Upload RLS List-------------------------------------------------------------------

  async addUploadRLSCacheData(type: string, data: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data
      this.storeUploadRLSTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeUploadRLSTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeUploadRLSTypeOfIndexDbData(Obj)
    }
  }
  async getUploadRLSIndexCacheData() {
    try {
      const data = await this.db.uploadRLS.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeUploadRLSTypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.uploadRLS, function () {
      this.db.uploadRLS.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearUploadRLSIndexTableData() {
    try {
      await this.db.uploadRLS.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //--------------------------------------------------------------------------------------------------------------------//


  //----------------------------------------Deal tech solutionList-------------------------------------------------------------------

  async addDealTechSolutionCacheData(type: string, data: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data
      this.storeDealTechSolutionTypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeDealTechSolutionTypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeDealTechSolutionTypeOfIndexDbData(Obj)
    }
  }
  async getDealTechSolutionIndexCacheData() {
    try {
      const data = await this.db.dealTechSolution.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeDealTechSolutionTypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.dealTechSolution, function () {
      this.db.dealTechSolution.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearDealTechSolutionIndexTableData() {
    try {
      await this.db.dealTechSolution.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //--------------------------------------------------------------------------------------------------------------------//




  //----------------------------------------- Calculate Deals------------------------------------------------------------

  /*-----------------Existing deals-------------*/
  async addExistingDealsCacheData(type: string, data: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data
      this.storeExistingDealsOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeExistingDealsOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeExistingDealsOfIndexDbData(Obj)
    }
  }
  async getExistingCacheData() {
    try {
      const data = await this.db.ExisitingDeals.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeExistingDealsOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.ExisitingDeals, function () {
      this.db.ExisitingDeals.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearExistingDealsData() {
    try {
      await this.db.ExisitingDeals.clear()
      return true
    } catch (error) {
      return false
    }
  }
  /*-------------Deal params-----------*/
  async addDealParamasCacheData(type: string, data: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data
      this.DealParamasOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.DealParamasOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.DealParamasOfIndexDbData(Obj)
    }
  }
  async getDealParamasCacheData() {
    try {
      const data = await this.db.dealparams.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async DealParamasOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.dealparams, function () {
      this.db.dealparams.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearDealParamasData() {
    try {
      await this.db.dealparams.clear()
      return true
    } catch (error) {
      return false
    }
  }
  /*-----------------Tagged deals-------------*/
  async addTaggedDealsCacheData(type: string, data: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data
      this.storeTaggedIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeTaggedIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeTaggedIndexDbData(Obj)
    }
  }
  async getTaggedCacheData() {
    try {
      const data = await this.db.TaggedDeals.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeTaggedIndexDbData(data) {
    await this.db.transaction('rw', this.db.TaggedDeals, function () {
      this.db.TaggedDeals.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearTaggedDealsData() {
    try {
      await this.db.TaggedDeals.clear()
      return true
    } catch (error) {
      return false
    }
  }
  /*-----------------Deal overview deals-------------*/
  async addDealOverviewCacheData(type: string, data: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data
      this.storeDealoverviewIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeDealoverviewIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeDealoverviewIndexDbData(Obj)
    }
  }
  async getDealoverviewCacheData() {
    try {
      const data = await this.db.DealOverview.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeDealoverviewIndexDbData(data) {
    await this.db.transaction('rw', this.db.DealOverview, function () {
      this.db.DealOverview.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearDealoverviewData() {
    try {
      await this.db.DealOverview.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //--------------------------------------------------Calculate-----------------------------------------------------------------
  async addCalculateCacheData(type: string, data: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data
      this.storeCalculateIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeCalculateIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeCalculateIndexDbData(Obj)
    }
  }
  async getCalculateIndexCacheData() {
    try {
      const data = await this.db.calculate.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeCalculateIndexDbData(data) {
    await this.db.transaction('rw', this.db.calculate, function () {
      this.db.calculate.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearCalculateIndexTableData() {
    try {
      await this.db.calculate.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //------------------------------------------------------------------------------------------------------------------------------


  //----------------------------------------Action List-------------------------------------------------------------------

  async addActionListCacheData(type: string, data: any, count: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
      count: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data,
        Obj.count = count
      this.storeActionListypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = count
      this.storeActionListypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = count
      this.storeActionListypeOfIndexDbData(Obj)
    }
  }
  async getActionListIndexCacheData() {
    try {
      const data = await this.db.createActionList.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeActionListypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.createActionList, function () {
      this.db.createActionList.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearActionListTableData() {
    try {
      await this.db.createActionList.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //-----------------------------------------Action List----------------------------------------------------------------------//

  //----------------------------------------Action List-------------------------------------------------------------------

  async addCalenderListCacheData(type: string, data: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
      count: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data,
      this.storeCalenderListypeOfIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
      this.storeCalenderListypeOfIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
      this.storeCalenderListypeOfIndexDbData(Obj)
    }
  }
  async getCalenderListIndexCacheData() {
    try {
      const data = await this.db.calenderList.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeCalenderListypeOfIndexDbData(data) {
    await this.db.transaction('rw', this.db.calenderList, function () {
      this.db.calenderList.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearCalenderListTableData() {
    try {
      await this.db.calenderList.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //-----------------------------------------Action List-------------------------------------------//

  //---------------------------------------Module Offline Services------------------------------------------------------------//

  async addModuleListData(type: string, data: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data
      this.storeModuleListIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeModuleListIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data
      this.storeModuleListIndexDbData(Obj)
    }
  }
  async getModuleListCacheData() {
    try {
      const data = await this.db.modulesAllList.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeModuleListIndexDbData(data) {
    await this.db.transaction('rw', this.db.modulesAllList, function () {
      this.db.modulesAllList.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearModuleListTableData() {
    try {
      await this.db.modulesAllList.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //---------------------------------------Module Offline Services------------------------------------------------------------//

  //---------------------------------------RLS List Offline Services------------------------------------------------------------//
  async addRLSListCacheData(type: string, data: any, count: any) {
    this.db.open().catch(function (e) {
      console.error("Open failed: " + e.stack);
    })
    let Obj = {
      id: null,
      type: null,
      data: null,
      count: null,
    }
    if (type == "Table") {
      Obj.id = 1,
        Obj.type = type,
        Obj.data = data,
        Obj.count = count
      this.storeRLSListIndexDbData(Obj)
    } else if (type == "Details") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = count
      this.storeRLSListIndexDbData(Obj)
    } else if (type == "Form") {
      Obj.id = Math.random(),
        Obj.type = type,
        Obj.data = data,
        Obj.count = count
      this.storeRLSListIndexDbData(Obj)
    }
  }
  async getRLSListCacheData() {
    try {
      const data = await this.db.rlsList.toArray()
      return data
    } catch (error) {
      return []
    }
  }
  async storeRLSListIndexDbData(data) {
    await this.db.transaction('rw', this.db.rlsList, function () {
      this.db.rlsList.add(data);
    }).catch(function (e) {
      console.log("Got error while adding in the index db")
      console.log(e)
    })
  }
  async ClearRLSListTableData() {
    try {
      await this.db.rlsList.clear()
      return true
    } catch (error) {
      return false
    }
  }
  //---------------------------------------RLS List Offline Services------------------------------------------------------------//
//-------------------------milestone offline service-----------------------------------
async addMilestoneListData(type: string, data: any) {
  this.db.open().catch(function (e) {
    console.error("Open failed: " + e.stack);
  })
  let Obj = {
    id: null,
    type: null,
    data: null
  }
  if (type == "Table") {
    Obj.id = 1,
      Obj.type = type,
      Obj.data = data
    this.storeMilestoneListIndexDbData(Obj)
  } else if (type == "Details") {
    Obj.id = Math.random(),
      Obj.type = type,
      Obj.data = data
    this.storeMilestoneListIndexDbData(Obj)
  } else if (type == "Form") {
    Obj.id = Math.random(),
      Obj.type = type,
      Obj.data = data
    this.storeMilestoneListIndexDbData(Obj)
  }
}
async getMilestoneListCacheData() {
  try {
    const data = await this.db.milestoneList.toArray()
    return data
  } catch (error) {
    return []
  }
}
async storeMilestoneListIndexDbData(data) {
  await this.db.transaction('rw', this.db.milestoneList, function () {
    this.db.milestoneList.add(data);
  }).catch(function (e) {
    console.log("Got error while adding in the index db")
    console.log(e)
  })
}
async ClearMilestoneListTableData() {
  try {
    await this.db.milestoneList.clear()
    return true
  } catch (error) {
    return false
  }
}
//--------------------milestone Offline service-------------------------------


//----------------------------------------Attach document list-------------------------------------------------------------------

async addAttachDocumentCacheData(type: string, data: any) {
  this.db.open().catch(function (e) {
    console.error("Open failed: " + e.stack);
  })
  let Obj = {
    id: null,
    type: null,
    data: null,
  }
  if (type == "Table") {
    Obj.id = 1,
      Obj.type = type,
      Obj.data = data
    this.storeAttachDocumentTypeOfIndexDbData(Obj)
  } else if (type == "Details") {
    Obj.id = Math.random(),
      Obj.type = type,
      Obj.data = data
    this.storeAttachDocumentTypeOfIndexDbData(Obj)
  } else if (type == "Form") {
    Obj.id = Math.random(),
      Obj.type = type,
      Obj.data = data
    this.storeAttachDocumentTypeOfIndexDbData(Obj)
  }
}
async getAttachDocumentIndexCacheData() {
  try {
    const data = await this.db.attachDocument.toArray()
    return data
  } catch (error) {
    return []
  }
}
async storeAttachDocumentTypeOfIndexDbData(data) {
  await this.db.transaction('rw', this.db.attachDocument, function () {
    this.db.attachDocument.add(data);
  }).catch(function (e) {
    console.log("Got error while adding in the index db")
    console.log(e)
  })
}
async ClearAttachDocumentIndexTableData() {
  try {
    await this.db.attachDocument.clear()
    return true
  } catch (error) {
    return false
  }
}
//--------------------------------------------------------------------------------------------------------------------//


}

