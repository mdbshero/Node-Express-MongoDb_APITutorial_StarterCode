const express = require("express");
const { valid } = require("joi");
const { Product, validateProduct } = require("../models/product");
const router = express.Router();

// GET all Products
//http://localhost:3011/api/products
router.get("/", async (req, res) => {
  try {
    let products = await Product.find();
    if (!products)
      return res.status(400).send(`No products in this collection!`);
    return res.status(200).send(products);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

// GET a product by ID
//http://localhost:3011/api/products/:productId
router.get("/:productId", async (req, res) => {
  try {
    let product = await Product.findById(req.params.productId);
    if (!product)
      return res
        .status(400)
        .send(`Product with Id of ${req.params.productId} does not exist!`);
    return res.status(200).send(product);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

// POST a new product
//http://localhost:3011/api/products
router.post("/", async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error);

    let newProduct = await new Product(req.body);
    await newProduct.save();

    return res.status(201).send(newProduct);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

//PUT and existing product
//http://localhost:3011/api/products/:productId
router.put("/:productId", async (req, res) => {
  try {
    const { error } = validateProduct(req.body);
    if (error) return res.status(400).send(error);

    let product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
      }
    );
    if (!product)
      return res
        .status(400)
        .send(`Product with Id of ${req.params.productId} does not exist!`);
    return res.send(product);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

//DELETE and existing product
//http://localhost:3011/api/products/:productId
router.delete("/:productId", async (req, res) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.productId);
    if (!product)
      return res
        .status(400)
        .send(`Product with Id of ${req.params.productId} does not exist!`);
    return res.send(200).send(product);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

module.exports = router;
