export interface UserInterface{
    name: string;
    password: string;
    selectedNumber:number;
    score:number;
    wonRound: boolean;
    isDealer:boolean;
    updateScore: Function
}