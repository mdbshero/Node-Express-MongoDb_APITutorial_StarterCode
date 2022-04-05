//TODO: Create a schema
//TODO: Create a model from that schema

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2, max: 255},
    description: {type: String, required: true, minlength: 2},
    category: {type: String, required: true, minlength: 2, max: 255},
    price: {type: Number, required: true},
    dateAdded: {type: Date, default:Date.now()}
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;