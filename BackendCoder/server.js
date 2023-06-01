import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";

import { ProductManager } from "./classes/productmanager.js";
import routerProductos from "./routes/products.router.js";
import routerCarrito from "./routes/carts.router.js";
import routerViews from "./routes/realTimeProducts.js";

const app = express();
export const PM = new ProductManager(__dirname + "/files/products.json");

app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// handlebars configuration
app.engine('handlebars', engine());
app.set('views', __dirname + "/views");
app.set('view engine', 'handlebars');

app.use("/api/products", routerProductos);
app.use("/api/carrito", routerCarrito);
app.use("/realtimeproducts", routerViews);

const expressServer = app.listen(8080, () => {
  console.log("Servidor iniciado en el puerto 8080");
});

const socketServer = new Server(expressServer);

const products = await PM.getProducts();

socketServer.on("connection", socket => {
    socketServer.emit('initProduct', products);
    socket.on("message", data => {
        console.log(data);
    });
});


