module.exports = class User{
    selectedNumber = null;
    score = 0;
    isDealer = false;
    wonRound = false;
    constructor( name, password){
        this.name = name;
        this.password = password;
    }
    updateScore(){
        this.score++;
    }
}