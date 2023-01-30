const{ Server } = require("socket.io");
const http = require("http");
const express = require("express");
const app = express();
// const io = new Server(8000, {
//   cors :{
//     origin :'wss://khan-pets-socket.vercel.app'
//   }
// });
const server = http.createServer(app);
const io = new Server(server)

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when ceonnect
    console.log("a user connected.");
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
     addUser(userId, socket.id);
     console.log(users);
        io.emit("getUsers",users)

   
      
    });

    //send Message
    socket.on("sendMessage",({receiverId,conversationId})=>{
        const user = getUser(receiverId)
        console.log(user);
        console.log(conversationId,receiverId);
        if(user){

          io.to(user.socketId).emit("getMessage",conversationId)
        }

    })
  
    
    
    socket.on("disconnect", () => {
      console.log("a user disconnected!");
      removeUser(socket.id)
      io.emit("getUsers",users)
      
      
    });
  });
  