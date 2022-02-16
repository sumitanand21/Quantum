import { Injectable } from '@angular/core';
import { ApiService } from '@app/core/services/api.service';

const  routes = {
  createMeeting: 'v1/MeetingManagement/Create_V1',
  editMeeting: 'v1/MeetingManagement/Edit_V1'
}

@Injectable({
  providedIn: 'root'
})

export class NewMeetingService {

  attachList: any =[]
  constructor( private apiService: ApiService) { }

  createMeeting(body) {
    return this.apiService.post(routes.createMeeting, body)
  }
  
  editMeeting(body) {
    return this.apiService.post(routes.editMeeting, body)
  }

  set attachmentList(attach) {
    this.attachList = attach
}

get attachmentList() {
    return this.attachList
}
}
