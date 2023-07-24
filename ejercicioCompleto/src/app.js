import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import sessionRouter from "./routes/session.router.js";
import viewsRouter from "./routes/views.routes.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import { initializePassportJWT } from "./config/jwt.passport.js";
import { initializePassportLocal } from "./config/local.passport.js";

const app = express();
const connection = mongoose.connect(
  "mongodb+srv://bardaleshector41:asd.456@cluster0.jobsexj.mongodb.net/practicaIntegradora2?retryWrites=true&w=majority"
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.use(cookieParser());
initializePassportJWT();
initializePassportLocal();
app.use(passport.initialize());
/*
app.use(
  session({
    store: new MongoStore({
      mongoUrl:
        "mongodb+srv://bardaleshector41:asd.456@cluster0.jobsexj.mongodb.net/practicaIntegradora2?retryWrites=true&w=majority",
    }),
    secret: "mongoSecret",
    resave: true,
    saveUninitialized: false,
  })
);*/

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

app.listen(8181, () => {
  console.log("servidor levantado");
});
