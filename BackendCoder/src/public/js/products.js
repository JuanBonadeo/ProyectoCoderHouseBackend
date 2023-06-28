const socket = io();

socket.on("connect", () => {
    console.log("Conectado al servidor");
  });
 



console.log(products)
 socket.on("update-products", (products) => {
    let productsContainer = document.getElementById("products-container")
    productsContainer.innerHTML = ""
  
    for (let product of products) {
      let productElement = document.createElement("div");
      productElement.innerHTML = `
        <p> Title: ${product.title} </p>
        <p> Description: ${product.description} </p>
        <p> Price: ${product.price} </p>
        <button id=${product.id} onclick="deleteProduct(this)"> Borrar </button>
      `
  
      productElement.setAttribute("style", "border: 1px solid #000; border-radius: 1rem; padding: 1rem; margin-bottom: 1rem")
      productsContainer.appendChild(productElement)
    }
  
  })

















