import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { AssistantGlobalService } from './assistant-global.service';
import { EnvService } from '@app/core/services/env.service';

@Injectable({
  providedIn: 'root'
})
export class AssistantSocketService {
  socket: SocketIOClient.Socket;
  private username: string;
  private empId: string;
  private socketId: any;

  constructor(private _globalServiceClass: AssistantGlobalService,private envService:EnvService) { }

  configFunc() {
    debugger;
    this.socket = io(this.envService.ellaUrl, { path: this.envService.Socket_PATH_URL + '/socket.io', transports: ['websocket'] });
    // this.socket.emit('user added', 'S-1-5-21-57989841-616249376-1801674531-2628750', new Date().toString());
    this.socket.emit('user_added_mobile', this._globalServiceClass.adid, this._globalServiceClass.userName, new Date().toString());
    // this.socket.on('user_added_mobile', (name: string, empid: any, socketid: any) => {
    //   console.log("sample");
    //   alert(name)
    //   alert(empid)
    //   alert(socketid)
    //   this.username = name.toLowerCase();
    //   this.empId = empid;
    //   this.socketId = socketid;
    // });
    this.socket.on('reply', function (data) {
      var responsedata = JSON.parse(data.message);
      console.log('reply data ', responsedata.message);
      data.message = responsedata.message;
      data.name = "Ella"
      var msgObj = { botName: "Ella", message: responsedata.message, qId: "0" };
      this.setServiceBotMessage(msgObj);
    }.bind(this));
    // this.socket.on('polyreply', function (data) {
    //   var responsedata = JSON.parse(data.message);
    //   console.log('reply data ', responsedata.message);
    //   // this.playAudio(responsedata.message);
    // }.bind(this));

  }

  public playAudio(message: string) {
    let audio = new Audio();
    audio.src = 'https://ella-elb.wipro.com/read?voiceId=Joanna&text=' + message + '&outputFormat=ogg_vorbis';
    audio.load();
    audio.play();
  }

  // EMITTER
  public sendMessage(msg: string) {
    console.log(this.socket.id)
    this.socket.emit("message", msg, this._globalServiceClass.userName, this._globalServiceClass.adid, this.socket.id, new Date().toString());
  }

  public setServiceBotMessage(msgObj) {
    if (msgObj.message.includes('We are sorry. Your session has expired')) {
      this._globalServiceClass.chatList.push({
        userType: 'Bot',
        displayName: msgObj.botName,
        dateTime: new Date(),
        data: 'We are sorry. Your session has expired. Please click Yes to Start the conversation, click No to end conversation.',
        qId: msgObj.qId,
        isHelpLine: false,
        isSession: true
      });
    }
    else if (msgObj.message.includes('Would you like me to raise a Helpline Ticket?')) {
      this._globalServiceClass.chatList.push({
        userType: 'Bot',
        displayName: msgObj.botName,
        dateTime: new Date(),
        data: 'Would you like me to raise a Helpline Ticket?',
        qId: msgObj.qId,
        isHelpLine: true,
        isSession: false
      });
    }
    else {
      this._globalServiceClass.chatList.push({
        userType: 'Bot',
        displayName: msgObj.botName,
        dateTime: new Date(),
        data: msgObj.message,
        qId: msgObj.qId,
        isHelpLine: false,
        isSession: false
      });
    }
  }
}
