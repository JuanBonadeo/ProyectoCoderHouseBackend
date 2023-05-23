import express from "express";

import ProductManager from "./index.js";

const app = express();

const PM = new ProductManager();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function getLimitedArray(array, count) {
  return array.slice(0, count);
}


app.get("/products", (req, res) => {
  PM.getProducts().then((products) => {
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

app.get('/products/:pid', async (req, res) => {
  const productId = req.params.pid;
  const product = await PM.getProductsById(productId);
  return res.json(product);
});

app.delete('/products/:pid', async (req, res) => {
  await PM.deleteProduct(req.params.pid);
  const newProducts = await PM.getProducts();
  
  return res.json(newProducts);
});



app.listen(8080, () => {
  console.log("Servidor iniciado en el puerto 8080");
});
