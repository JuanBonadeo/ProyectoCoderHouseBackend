import express from "express";
import routerProductos from "./routes/products.router.js";
import routerCarrito from "./routes/carts.router.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", routerProductos);
app.use("/api/carrito", routerCarrito);

app.listen(8080, () => {
  console.log("Servidor iniciado en el puerto 8080");
});
