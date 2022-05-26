const express = require("express");
const app = express();
const http = require("http");
const User = require("./user.model");

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let connectedSockets = 0;
let users = [
    new User("dannyboi", "dre@margh_shelled"),
    new User("matty7", "win&win99"),
];
let turn = 0;
io.on('connection', (socket) => {
    users.forEach((user)=>{
        user.score = 0;
    })
    // Sends user to the 
    socket.emit("send users",{users})
    connectedSockets = 0;
    socket.on("user connected",(user)=>{
        const currentUser = users.filter((selectedUser)=>{
            return selectedUser.name == user.name;
        })[0];
        connectedSockets++;
        socket.emit("waiting", "Waiting on all Players");

        if(connectedSockets == 2){
            refreshSelection();
            turn = 1;
            io.emit("resume play");
            const randomNum = Math.round(Math.random() * 1)
            users[randomNum].isDealer = !users[randomNum].isDealers;
            io.emit("New Game", {users});
        }

        console.log(connectedSockets);
        socket.on("dealer choosing",(user)=>{
            socket.emit("resume play");
            socket.broadcast.emit("waiting","Waiting on the Dealer");
        })
        socket.on("make choice",(response)=>{
        
            user = searchArrayByName(users,response.user);

            user.selectedNumber = response.value;
            if(users.every((user)=>{
                return (user.selectedNumber);
            })){
                turn++;
                console.log("both users selected on turn ", turn)
                checkWinners();
                changeDealer();
                io.emit("points standing",{users});
                if(turn > 5){
                    io.emit("resume play");
                    io.emit("GameOver",tallyPoints());
                    io.emit("Thanks for Playing");

                }else{
                    refreshSelection();
                    io.emit("newTurn",{value: turn});
                    io.emit("resume play");
                }

        }else{
            socket.broadcast.emit("resume play", user);
            socket.emit("waiting","Waiting on the Spotter");
        }

    });
    
    socket.emit("userFound",{currentUser});
        
    })
    socket.on("restart",()=>{

    })
    socket.on('disconnect',disconnectUser);
});

function disconnectUser(user){
    if(!(connectedSockets == 0)){
        connectedSockets--;
    }
    users.forEach(user=> user.isDealer = false);
}
function searchArrayByName(array,name){
    let elements = array.filter((element)=>{
        return element.name == name
    });
    if(elements.length == 0){
        return false
    }
    else return elements[0];
}
function checkWinners() {
    if(users[0].selectedNumber == users[1].selectedNumber){
        if(users[0].isDealer){
            users[1].updateScore();
            users[1].wonRound = true;
        }else{
            users[0].updateScore();
            users[0].wonRound = true;
        }
  
    
    }else{
        if(users[0].isDealer){
            users[0].updateScore();
            users[0].wonRound = true;
        }else{
            users[1].updateScore();
            users[1].wonRound = true;
        }
    }
}
function tallyPoints(){
    if(users[0].score > users[1].score){
        return users[0]
    }else return users[1];
}
function changeDealer(){
    users.forEach(user=> user.isDealer  = !user.isDealer)
}

function refreshSelection(){
    users.forEach(user=> {user.selectedNumber = null, user.wonRound = false})
}


server.listen(7621, () => {
    console.log("Server up on Port: http://localhost:7621")
});
