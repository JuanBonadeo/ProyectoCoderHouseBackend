import { error } from "console";
import { Router } from "express";
import { ProductManager } from "../classes/productmanager.js";


const router = Router();


const PM = new ProductManager();

router.get('/', async (req, res) => {
    await PM.getProducts().then((products) => {
        res.render('realtimeproducts', {  title: "Productos", products })
    });
});



export default router;