/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */
const express = require('express');
const router = express.Router();
const Product = require('./product');


/**
 * @openapi
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: Successful operation
 */
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: Product not found
 */
router.get('/products/:id', getProduct, (req, res) => {
  res.json(res.product);
});

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Add a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Bad request
 */
router.post('/products', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    category: req.body.category,
    seller: req.body.seller,
    count: req.body.count
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Successful operation
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 */
router.patch('/products/:id', getProduct, async (req, res) => {
  if (req.body.name != null) {
    res.product.name = req.body.name;
  }
  if (req.body.category != null) {
    res.product.category = req.body.category;
  }
  if (req.body.seller != null) {
    res.product.seller = req.body.seller;
  }
  if (req.body.count != null) {
    res.product.count = req.body.count;
  }

  try {
    const updatedProduct = await res.product.save();
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/products/:id', getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
    if (product == null) {
      return res.status(404).json({ message: 'Product with Id ' +  req.params.id + ' not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.product = product;
  next();
}

module.exports = router;
