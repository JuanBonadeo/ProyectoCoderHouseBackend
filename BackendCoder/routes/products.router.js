import { Router } from "express";
import express from "express";
import { ProductManager } from "../classes/productmanager.js";




const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



function getLimitedArray(array, count) {
  return array.slice(0, count);
}

const PM = new ProductManager();

router.get("/", (req, res) => {
  PM.getProducts().then((products) => {
    const limit = parseInt(req.query.limit);

    if (limit && !Number.isInteger(limit)) {
      res.status(400).json({
        error:
          "El parámetro limit debe ser un numero mayor a 0 y debe ser un entero.",
      });
      return;
    }

    res.send(limit > 0 ? getLimitedArray(products, limit) : products);
  });
});

router.get("/:pid", async (req, res) => {
  const productId = req.params.pid;
  const product = await PM.getProductsById(productId);
  return res.json(product);
});

router.delete("/:pid", async (req, res) => {
  await PM.deleteProduct(req.params.pid);
  const newProducts = await PM.getProducts();

  return res.json(newProducts);
});

router.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  } = req.body;

  try {
    await PM.addProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    );
    res.send("Producto agregado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

export default router;
