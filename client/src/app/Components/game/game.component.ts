import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { UserInterface } from 'src/app/Services/user.model';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() user !: UserInterface;
  @Output() choice: EventEmitter<number> = new EventEmitter();
  @ViewChild('cardGrid') cardGrid!: ElementRef
  @ViewChildren('card') cards!: QueryList<ElementRef>
  
  constructor(public _userService: UserService) { }

  ngOnInit(): void {

  }
  submitChoice(choiceField:HTMLInputElement){
    console.log(choiceField.value)
    this._userService.currentUser.selectedNumber = Number(choiceField.value);
    this.choice.emit(Number(choiceField.value))
    
  }
  makeChoice(choice:number){
    if(choice > 3){
      choice = 3
    }else if(choice < 1){
      choice = 1; 
    }
    console.log(this.cards)
    this._userService.currentPlayerTurn = false;
    
     if(!this._userService.currentUser.isDealer){
      //  get the 
      this.cards.toArray().forEach((card, index)=>{

        if(this._userService.dealerChoice == card.nativeElement.id){
          card.nativeElement.classList.add("flipCard-queen");
        }else{
          card.nativeElement.classList.add("flipCard-joker");
        }});

      setTimeout(() =>{
        this.cards.toArray().forEach((card, index)=>{
            card.nativeElement.classList.remove("flipCard-queen");
            card.nativeElement.classList.remove("flipCard-joker");
          });
          this.choice.emit(choice);
      }, 3000);

     }else this.choice.emit(choice);
  }
}
