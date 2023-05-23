import { log} from "console";
import { promises } from "dns";
import fs from "fs";
import { get } from "http";

class ProductManager {
    constructor() {
        this.products = []
        this.path = "./files/productos.json"
    }

    getProducts = async () => {
        this.products = await this.getArchivo();
        if ( this.products.length === 0) {
            console.log("No hay productos cargados")
            return []
        } else {
            return this.products
        }
    }

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
    
    addProduct = async (title, description, price, thumbnail, code, stock) =>  {
        // validacion 
        if (title === null || description === null || price === null || thumbnail === null || stock === null) {
            console.log("Debe completar todos los campos, para que el prodcuto sea agregado.");
            return;
          }
        // entrada de datos
        const products = await this.getArchivo();
        this.products = products;

        // cargar productos desde el archivo
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        // id dinamico
        if (this.products.length === 0) {
            product.id = 1
        } else {
            product.id = this.products[this.products.length - 1].id + 1
        }
        // validacion
        let codeIntroducido = this.products.find(product=> product.code === code)
        if(codeIntroducido){
            console.log("error, codigo repetido")
        } else{
            // salida de datos
            this.products.push(product)
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null , "\t"));
            console.log(this.products);
        }
        
    }
    getProductsById = async (id) => {
        const list = await this.getProducts();
        return list.find((prod) => prod.id == id) ?? "Producto no encontrado";
    }
    updateProduct = async (id, prop, value) => {
        // entrada de datos
        const products = await this.getArchivo();
        this.productos = products;
        // validacion
        const productPorId = await this.getProductsById(id);
        if (productPorId === "not found"){
            console.log("el id no pertenece a ningun producto existente")
        }
        //modifica
        const productFound = await this.products.find((product) => product.id === id)
        productFound[prop] = value
        // salida de datos
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null , "\t"));
        console.log(`El producto con el id ${id} se ha actualizado`);
    }
    deleteProduct = async (id) => {
        // entrada de datos
        const products = await this.getArchivo();
        this.products = products;
        // validacion
        const productPorId = await this.getProductsById(id);
        if (productPorId === "not found"){
            console.log("el id no pertenece a ningun producto existente")
        }
        //elimina
        const productFiltrados = products.filter((product) => {
            return product.id != id
        })
       
        // salida de datos
        await fs.promises.writeFile(this.path, JSON.stringify(productFiltrados, null , "\t"));
        console.log(`El producto con el id ${id} ah sido eliminado`);
    }
    
}
export default ProductManager

const manejo = new ProductManager();
//Agregar productos
manejo.addProduct(
    "Samsumg S21",
    "Celular",
    200000,
    "url",
    "abc123",
    10  
);
manejo.addProduct(
    "iPad Pro",
    "Tablet",
    1200000,
    "url",
    "pro123",
    15
);
manejo.addProduct(
    "Dell XPS 13",
    "Laptop",
    2500000,
    "url",
    "xps13def",
    5
);
manejo.addProduct(
    "Canon EOS R6",
    "Cámara",
    4000000,
    "url",
    "r6ghi",
    8
);
manejo.addProduct(
    "PlayStation 5",
    "Consola",
    900000,
    "url",
    "ps5jkl",
    12
);

// Mostrar lista de productos
// console.log("----------------------------------------------");
// console.log("Lista de productos:");
// const productList = await menejo.getProducts();
// console.log(productList);
// console.log("----------------------------------------------");

// Buscar producto por id
// console.log("Producto por Codigo");
// const productFind = await manejo.getProductById("aca iria el id");
// console.log(productFind);

// Modificar un producto
// await manejo.updateProduct(2, "title", "newTite")
                           //(id, propiedad, nuevo valor)

// Eliminar un producto 
// await manejo.deleteProduct(id a eliminar)

