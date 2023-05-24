import { error } from "console";
import { Router } from "express";
import fs from "fs";
import { ProductManager } from "./products.router.js";

const router = Router();

class CartManager {
  constructor() {
    this.path = "./files/carrito.json";
    this.PM = new ProductManager();
  }

  async addProductToCart(cartId, productId) {
    try {
      const carts = await this.getCarrito();
      let cart = carts.find((cart) => cart.id === cartId);

      if (!cart) {
        cart = { id: cartId, products: [] };
        carts.push(cart);
      }
      const productExists = await this.PM.checkIfExist(productId);
      if (productExists) {
        const productIndex = cart.products.findIndex(
          (product) => product.id === productId
        );
        if (productIndex !== -1) {
          cart.products[productIndex].qty++;
        } else {
          cart.products.push({ id: productId, qty: 1 });
        }
      } else {
        const errorMessage =
          "El id que ingresaste no pertenece a ningún producto";
        throw new Error(errorMessage);
      }

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      throw error;
    }
  }

  async getCarrito(cartId = null) {
    try {
      const data = await fs.promises.readFile(this.path, "utf8");
      const carts = JSON.parse(data);

      if (cartId) {
        const cart = carts.find((cart) => cart.id === cartId);
        return cart ? [cart] : [];
      }

      return carts;
    } catch (error) {
      console.error("Error al leer el archivo del carrito:", error);
      return [];
    }
  }
}

function getLimitedArray(array, count) {
  return array.slice(0, count);
}

const cartManager = new CartManager();

router.get("/", async (req, res) => {
  cartManager.getCarrito().then((products) => {
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
router.get("/:cid", async (req, res) => {
  const cid = req.params.cid;
  try{
    cartManager.getCarrito(cid).then((products) => {
    res.send(products);
  });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
  
});

router.post("/add/:cid/:pid", async (req, res) => {
  const cid = req.params.cid; // carritoid
  const pid = req.params.pid; // product id
  try {
    await cartManager.addProductToCart(cid, pid);
    res.send("Producto agregado al carrito exitosamente");
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message); // Envía el mensaje de error al cliente de Postman
  }
});

export default router;
