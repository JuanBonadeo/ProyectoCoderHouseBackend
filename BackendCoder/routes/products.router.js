import { Router } from "express";
import express from "express";

import fs from "fs";

const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

export class ProductManager {
  constructor() {
    this.products = [];
    this.path = "./files/productos.json";
  }

  getProducts = async () => {
    this.products = await this.getArchivo();
    if (this.products.length === 0) {
      console.log("No hay productos cargados");
      return [];
    } else {
      return this.products;
    }
  };

  getArchivo = async () => {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const productos = JSON.parse(data);
      return productos;
    } catch (error) {
      console.log("Se produjo un error al leer el archivo:", error);
      throw error; // Propaga el error lanzando una excepción
    }
  };

  addProduct = async (
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails = []
  ) => {
    // validacion
    if (
      title === null ||
      description === null ||
      code === null ||
      price === null ||
      stock === null ||
      category === null
    ) {
      const errorMessage =
        "Debe completar todos los campos, para que el prodcuto sea agregado.";
      throw new Error(errorMessage);
    }
    if (typeof status !== "boolean") {
      const errorMessage = "El campo 'status' debe ser de tipo booleano.";
      throw new Error(errorMessage);
    }

    if (!Array.isArray(thumbnails)) {
      const errorMessage = "El campo 'thumbnails' debe ser un arreglo.";
      throw new Error(errorMessage);
    }
    // if (
    //   typeof title !== "string" ||
    //   typeof description !== "string" ||
    //   typeof code !== "string" ||
    //   typeof price !== "number" ||
    //   typeof status !== "string" ||
    //   typeof stock !== "number" ||
    //   typeof category !== "string" ||
    //   !Array.isArray(thumbnails)
    // ) {
    //   const errorMessage = "Algunos de los campos ingresado no corresponde con el tipo de dato requerido";
    //   throw new Error(errorMessage);
    // }
    // entrada de datos
    const products = await this.getArchivo();
    this.products = products;

    // cargar productos desde el archivo
    const product = {
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
    };
    // id dinamico
    if (this.products.length === 0) {
      product.id = 1;
    } else {
      product.id = this.products[this.products.length - 1].id + 1;
    }
    // validacion
    let codeIntroducido = this.products.find(
      (product) => product.code === code
    );
    if (codeIntroducido) {
      const errorMessage = "Error, codigo repetido";
      throw new Error(errorMessage);
    } else {
      // salida de datos
      this.products.push(product);
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, "\t")
      );
      console.log(product);
    }
  };
  getProductsById = async (id) => {
    const list = await this.getProducts();
    return list.find((prod) => prod.id == id) ?? "Producto no encontrado";
  };
  updateProduct = async (id, prop, value) => {
    // entrada de datos
    const products = await this.getArchivo();
    this.productos = products;
    // validacion
    const productPorId = await this.getProductsById(id);
    if (productPorId === "not found") {
      console.log("el id no pertenece a ningun producto existente");
    }
    //modifica
    const productFound = await this.products.find(
      (product) => product.id === id
    );
    productFound[prop] = value;
    // salida de datos
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, "\t")
    );
    console.log(`El producto con el id ${id} se ha actualizado`);
  };
  deleteProduct = async (id) => {
    // entrada de datos
    const products = await this.getArchivo();
    this.products = products;
    // validacion
    const productPorId = await this.getProductsById(id);
    if (productPorId === "not found") {
      console.log("el id no pertenece a ningun producto existente");
    }
    //elimina
    const productFiltrados = products.filter((product) => {
      return product.id != id;
    });

    // salida de datos
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productFiltrados, null, "\t")
    );
    console.log(`El producto con el id ${id} ah sido eliminado`);
  };
  checkIfExist = async (id) => {
    const products = await this.getProducts();
    const productIndex = products.findIndex((p) => p.id == id);

    return productIndex !== -1;
  };
}

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
