import express from "express";

import ProductManager from "./index.js";

const app = express();

const pM = new ProductManager("./products.json");

app.use(express.json());

function getLimitedArray(array, count) {
  return array.slice(0, count);
}

app.use(express.urlencoded({ extended: true }));

app.get("/products", (req, res) => {
  pM.getProducts().then((products) => {
    const limit = parseInt(req.query.limit);

    if (limit && !Number.isInteger(limit)) {
      res
        .status(400)
        .json({
          error:
            "El parámetro limit debe ser un numero mayor a 0 y debe ser un entero.",
        });
      return;
    }

    res.send(limit > 0 ? getLimitedArray(products, limit) : products);
  });
});

app.get('/products/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const product = await pM.getProductsById(id);
  
      if (product === "not found") {
        res.status(404).json({ error: "Product not found" });
      } else {
        res.json(product);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });



app.listen(8080, () => {
  console.log("Servidor iniciado en el puerto 8080");
});
