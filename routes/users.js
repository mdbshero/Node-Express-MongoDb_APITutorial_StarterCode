const express = require("express");
const { User, validateUser } = require("../models/user");
const router = express.Router();
const { Product, validateProduct } = require("../models/product");

//POST a user
//http://localhost:3011/api/users
router.post("/", async (req, res) => {
  try {
    let { error } = validateUser(req.body);
    if (error) return res.status(400).send(`Body for user not valid! ${error}`);

    let newUser = await new User(req.body);
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

//GET all users
//http://localhost:3011/api/users
router.get("/", async (req, res) => {
  try {
    let users = await User.find();
    if (!users) return res.status(400).send(`No users in the collection!`);
    return res.send(users);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

//POST a new product to a shopping cart
//http://localhost:3011/api/users/:userId/shoppingcart/:productId
router.post("/:userId/shoppingcart/:productId", async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user)
      return res.status(400).send(`User with Id ${req.params.userId}!`);

    let product = await Product.findById(req.params.productId);
    if (!product)
      return res
        .status(400)
        .send(`Product with id ${req.params.productId} does not exist!`);

    user.shoppingCart.push(product);
    await user.save();
    return res.send(user.shoppingCart);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

//PUT an existing product in a shopping cart
//http://localhost:3011/api/users/:userId/shoppingcart/:productId
router.put("/:userId/shoppingcart/:productId", async (req, res) => {
  try {
    let { error } = validateProduct(req.body);
    if (error)
      return res.status(400).send(`Body for product not valid! ${error}`);

    let user = await User.findById(req.params.userId);
    if (!user)
      return res.status(400).send(`User with Id ${req.params.userId}!`);

    const product = user.shoppingCart.id(req.params.productId);
    if (!product)
      return res
        .status(400)
        .send(`The product does not exist in the shopping cart!`);
    product.name = req.body.name;
    product.description = req.body.description;
    product.category = req.body.category;
    product.price = req.body.price;

    await user.save();
    return res.send(product);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

//DELETE an existing product in a shopping cart
//http://localhost:3011/api/users/:userId/shoppingcart/:productId
router.delete("/:userId/shoppingcart/:productId", async (req, res) => {
  try {
    let user = await User.findById(req.params.userId);
    if (!user)
      return res.status(400).send(`User with Id ${req.params.userId}!`);

    let product = user.shoppingCart.id(req.params.productId);
    if (!product)
      return res
        .status(400)
        .send(`The product does not exist in the shopping cart!`);
    product = await product.remove();
    await user.save();
    return res.send(product);
  } catch (error) {
    return res.status(500).send(`Internal Server Error: ${error}`);
  }
});

module.exports = router;
