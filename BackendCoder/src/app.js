import express from "express";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";

import __dirname from "./utils.js";

import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerViews from "./routes/views.router.js";
import routerMessages from "./routes/messages.router.js";

import { Server } from "socket.io";


import ProductManager from "./daos/mongodb/ProductManager.class.js";
import MessagesManager from './daos/mongodb/MessagesManager.class.js';
import CartManager from "./daos/mongodb/CartManager.class.js";
export const productManager = new ProductManager();
export const messagesManager = new MessagesManager();

// initial configuration

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static

app.use(express.static(__dirname + "/public"));

// handlebars configuration

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// server start and socket io

const expressServer = app.listen(8080, () => console.log("Servidor levantado"));

const socketServer = new Server(expressServer);

const messages = [];

socketServer.on("connection", (socket) => {
  console.log("Nuevo Cliente conectado " + socket.id); 
  
  socketServer.emit('cargarProductos', productos);

  socket.on("message", data => {
      console.log(data);
  }); 

  socket.on("message", (data) => {
    console.log(data)
    messagesManager.create(data.user,data.message);
    mensajes.push(data); 
    socketServer.emit("imprimir", mensajes);
  });

  socket.on("autenticatedUser", (data) => {
    socket.broadcast.emit("newUserAlert", data);
  });


});

  
// 
app.use((req,res,next) => {
  req.socketServer = socketServer;
  next()
})

app.use("/", routerViews);
app.use("/products/", routerProducts);
app.use("/carts/", routerCarts);
app.use("/messages/",routerMessages)

