import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SocketService } from 'src/app/Services/socket.service';
import { UserInterface } from 'src/app/Services/user.model';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  checkValidity = false
  constructor(private _userService: UserService, socketService: SocketService) { }
  @Output() userConnected: EventEmitter<UserInterface> = new EventEmitter();

  ngOnInit(): void {
  }
  validateForm(formData: NgForm): void {
    if(!this._userService.validateUser(formData.value)){
      console.log("This user is not Authorized to play");
      setTimeout(()=>{
        formData.form.controls['username'].setErrors({"Incorrect username": true})
        formData.form.controls['password'].setErrors({"Incorrect password": true});
        console.log(formData.valid);
      })
      
    }else{
      formData.form.controls['password'].setErrors(null);
      formData.form.controls['username'].setErrors(null);
      this.userConnected.emit(this._userService.currentUser);
    }
  }
  logoff(){}

}
