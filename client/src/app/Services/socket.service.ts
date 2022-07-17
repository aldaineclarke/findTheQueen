import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn:"root"
})
export class SocketService {
  socket!:Socket

  constructor(private _http:HttpClient) { }

  connectSocket(){

  }
  disconnectSocket(user: string){
    console.log(user);
    this.socket.emit("leave game", {user});
  }

}
