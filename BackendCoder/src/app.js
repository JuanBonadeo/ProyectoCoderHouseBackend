import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { initializePassport } from "./config/passport.config.js";
import passport from "passport";

import __dirname from "./utils.js";

import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerViews from "./routes/views.router.js";
import routerMessages from "./routes/messages.router.js";
import routerSessions from "./routes/session.router.js";




import ProductManager from "./daos/mongodb/ProductManager.class.js";
import MessagesManager from './daos/mongodb/MessagesManager.class.js';
import CartManager from "./daos/mongodb/CartManager.class.js";
import { userModel } from "./daos/mongodb/models/user.model.js";

export const productManager = new ProductManager();
export const messagesManager = new MessagesManager();

// initial configuration

const app = express();
// intializePassport()
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars configuration

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");


// configuracion de session
initializePassport()
app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://juancruzbonadeo04:Juan2004@cluster0.enwrd7s.mongodb.net/?retryWrites=true&w=majority",
    }),
    secret: "mongoSecret",
    resave: true,
    saveUninitialized: false,
  })
);

//uso passport
app.use(passport.initialize())
app.use(passport.session())


// server start and socket io

const expressServer = app.listen(8080, () => console.log("Servidor levantado"));



app.use("/", routerViews);
app.use("/products/", routerProducts);
app.use("/carts/", routerCarts);
app.use("/messages/",routerMessages)
app.use("/session/",routerSessions)

