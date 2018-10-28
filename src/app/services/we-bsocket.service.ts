import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import {HttpService} from './http.service';
@Injectable({
  providedIn: 'root'
})
export class WeBSocketService {

  constructor(private httpService:HttpService) { }
  private url = 'http://localhost:9000';//'http://172.25.91.48:8888'; //
  private socket;

  public sendMessage(message) {
    this.socket.emit('data', message);
    console.log("MESSAGE SENT");
  }

  public getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.httpService.serviceUrl);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
       // this.socket.disconnect();
      }
    })
    return observable;
  }

}
