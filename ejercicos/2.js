class ProductManager {
    constructor() {
        this.products = []
    }
    getProducts() {
        return this.products
    }
    addProduct(title, description, price, thumbnail, code, stock) {
        const product = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        }
        if (this.products.length === 0) {
            product.id = 1
        } else {
            product.id = this.products[this.products.length - 1].id + 1
        }
        let codeIntroducido = this.products.find(product=> product.code === code)
        if(codeIntroducido){
            console.log("error, codigo repetido")
        } else{
            this.products.push(product)
        }
        
    }
    getProductsById(id) {
        let productoBuscado = this.products.find(product=> product.id === id)
        if(productoBuscado){
            console.log("este es tu producto encontrado por id")
            console.log(productoBuscado)
        } else {
            console.log("not found")
        }
        
    }
}

const nuevoProducto = new ProductManager()
nuevoProducto.addProduct('iPhone', 'es alto celu amigo', 2000000, "https://iphone.jpg", "ahgo789bnm", 32)

console.log(nuevoProducto.getProducts())
nuevoProducto.addProduct('Samsung Galaxy', 'el rival del iPhone', 1800000, "https://galaxy.jpg", "ahgo789bnm", 20)
nuevoProducto.getProductsById(5)
nuevoProducto.getProductsById(1)
