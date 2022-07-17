import { Injectable } from '@angular/core';
import {  UserInterface } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _validUsers!:UserInterface[]
  public _currentUser!:UserInterface;
  // private _currentUser!:User;
  currentPlayerTurn = false;
  dealerChoice:number = 0;
  private result:UserInterface[] = []
  get currentUser(){
    return this._currentUser;
  }
  set currentUser(value:UserInterface){
    this._currentUser == value;
  }
  get validUsers(){
    return this._validUsers
  }
  set validUsers(value:UserInterface[]){
    this._validUsers = value;
  }
  constructor() { }

  updateUser(){
    this.validUsers.forEach((user)=>{
      if(this.currentUser.name == user.name){
        this._currentUser = user;
      }
    })
  }
  updateUsers(users:UserInterface[]){
    this.validUsers = users
    this.updateUser();
  }
  validateUser(formData:any):boolean{
    this.result = this._validUsers.filter((user)=>{
      return (user.name == formData.username) && (user.password == formData.password)

    });
    if(!(this.result.length == 0)){
      this._currentUser = this.result[0];
      return true;
    }
    else return false;

  }
}
