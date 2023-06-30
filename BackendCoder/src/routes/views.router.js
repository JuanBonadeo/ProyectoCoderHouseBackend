import { Router } from 'express';
import __dirname from "../utils.js"
import ProductManager from '../daos/mongodb/ProductManager.class.js';
import MessagesManager from '../daos/mongodb/MessagesManager.class.js';



let productManager = new ProductManager()
let messagesManager = new MessagesManager();

const router = Router();

router.get('/', async (req,res)=>{
  const productos= await productManager.getProducts(req.query.limit);
  res.render('home', {
    products: productos,
    style:"style.css"
  })
})

router.get('/products',async (req,res)=>{
  let page = req.query.page;
  let limit=req.query.limit;
  let sort=req.query.sort;
  let filtro=req.query.filtro;
  let filtroVal=req.query.filtroVal;
  let result= await productManager.getProducts(limit,page,sort,filtro,filtroVal);
  
  result.prevLink = result.hasPrevPage?`http://localhost:8080/products?page=${result.prevPage}&limit=${result.limit}`:'';
  result.nextLink = result.hasNextPage?`http://localhost:8080/products?page=${result.nextPage}&limit=${result.limit}`:'';
  result.isValid= !(page<=0||page>result.totalPages)
  res.render('home',result) 
})

router.get('/products/:id',async (req,res)=>{ 
  const id = req.params.id;
  let result = await productManager.getProductById(id)
  res.render('product',result) 
})



router.get('/messages', async (req, res) => {
  const messages= await messagesManager.getMessages();
    res.render('chat', { messages: messages, style: "style.css", title: "Mensajes" })

});


router.get('/realtimeproducts', async (req,res)=>{
  res.render('realTimeProducts');
})


export default router;