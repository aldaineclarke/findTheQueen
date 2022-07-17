import { Component } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { SocketService } from './Services/socket.service';
import { UserInterface } from './Services/user.model';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  socket !: Socket;
  gameOver  = false;
  winnerOfRound!:UserInterface;
  constructor(private socketService: SocketService, readonly _userService: UserService){}
  startGame = false
  currentUser!: UserInterface;
  isWinner = false;
  turn = 1;
  waiting = false;
  waitingMessage = '';
  ngOnInit(){
    this.socket = io("http://localhost:7621");
    this.socket.on("send users",(response)=>{
      this._userService.validUsers = response.users
    });
    this.socket.on("New Game",(response)=>{
      this._userService.updateUsers(response.users);
      this.currentUser = this._userService.currentUser;
      console.log(this.currentUser);
      if(this._userService.currentUser.isDealer){
        this.socket.emit("dealer choosing",{user:this._userService.currentUser})
      }
      this.start();
    });
    this.socket.on("points standing", (response)=>{
      this._userService.updateUsers(response.users);
      this.currentUser = this._userService.currentUser;
      console.log(response.users)

    })
    this.socket.on("waiting",(response)=>{
      this.waiting = true;
      this._userService.currentPlayerTurn = false;
      if(response){
        this.waitingMessage = response;
        console.log(this.waitingMessage);
      }

    });
    this.socket.on("resume play",(user:UserInterface)=>{
      this.waiting = false;
      this._userService.currentPlayerTurn = true;
      if(user){
        this._userService.dealerChoice = user.selectedNumber;
      }
    })
    this.socket.on("GameOver",(response)=>{
      this.waiting = false;

      this.gameOver  = true;
      if(response.name == this._userService.currentUser.name){
        this.isWinner = true
      }else this.isWinner = false;
    });
    this.socket.on("Thanks for Playing", ()=>{
      // the timeout function prevents one socket from disconnecting before the other, so if not then the other socket will be in the waiting state. 
      setTimeout(()=>{
        this.socket.disconnect();
      })
    });
    this.socket.on("victor",()=>{
      this.isWinner = true;
    });
    this.socket.on("defeat",()=>{
      this.isWinner = false;
    });
    this.socket.on("newTurn", (turn)=>{
      if(this._userService.currentUser.isDealer){
        this.socket.emit("dealer choosing",{user:this._userService.currentUser})
      }
      this.turn = turn.value;
    })
  }
    logoff(){
      this.socketService.disconnectSocket("Micheal");
    }
    connectUser(user:UserInterface){
      this.socket.emit("user connected", {user});
      this.socket.on("userFound", (user)=>{
        this._userService.currentUser = user;
      })
    }
    start(){
      this.startGame = true;
    }
    chozenNumber(choice:number){
      this.socket.emit("make choice", {value:choice, user: this._userService.currentUser.name});
    }
    restartGame(){
      // TODO: Finalize the option to restart game
      this.socket.connect();
      this.gameOver = false;
      this.startGame = false;
    }
  

  
}
