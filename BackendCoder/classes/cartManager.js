import { ProductManager } from "../classes/productmanager.js";
export class CartManager {
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