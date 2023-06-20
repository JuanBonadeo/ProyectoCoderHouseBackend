
import mongoose from 'mongoose'
import { productsModel } from './models/products.model.js'


export default class ProductManager {
  connection = mongoose.connect('mongodb+srv://juancruzbonadeo04:Juan2004@cluster0.enwrd7s.mongodb.net/?retryWrites=true&w=majority')
  



  async addProduct(product) {
   let result = await productsModel.create(product) 
   return result;
  }

  async getProducts(limit = null) {
    let result = await productsModel.find()
    return result
  }

  async getProductById(id) {
    let result = await productsModel.findOne({_id: id})
    return result

  }

  async updateProduct(id, updatedProduct) {

    let result = await productsModel.updateOne({_id: id}, {$set: updatedProduct})
    return result;

  }

  async deleteProduct(id) {
    let result = await productsModel.deleteOne({_id: id})
    return result
  }
}