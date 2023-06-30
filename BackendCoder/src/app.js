import express from "express";
import handlebars from "express-handlebars";

import __dirname from "./utils.js";

import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerViews from "./routes/views.router.js";
import routerMessages from "./routes/messages.router.js";

import { Server } from "socket.io";


import ProductManager from "./daos/mongodb/ProductManager.class.js";
import MessagesManager from './daos/mongodb/MessagesManager.class.js';
export const productManager = new ProductManager();
export const messagesManager = new MessagesManager();

// initial configuration

const app = express();

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

socketServer.on("connection", async (socket) => {
  console.log("Nuevo Cliente conectado " + socket.id);

  // Se envian todos los productos al conectarse
  socket.emit("load-products", await productManager.getProducts());

  socket.on("messages", data => {
    console.log(data)
  })
  socket.on("messages", data => {
    console.log(data)
    messagesManager.Create(data.user,data.message)
    messages.push(data)
    socketServer.emit("print", messages)
  })
  
  socket.on("autenticatedUser", (data) => {
    socket.broadcast.emit("newUserAlert", data);
  });
  
  socket.on("delete-product", async (productID) => {
    await productManager.deleteProduct(productID);
    socketServer.emit("update-products", await productManager.getProducts());
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

