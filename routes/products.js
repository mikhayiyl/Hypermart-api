const router = require("express").Router();
const { Genre } = require("../models/genre");
const { Category } = require("../models/category");
const { validate, Product } = require("../models/product");
const validator = require("../middleware/validate");
const admin = require("../middleware/admin");
const objId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");




//get all products
router.get("/", async (req, res) => {
    const qnew = req.query.new
    const category = req.query.category;

    let products;
    if
        (qnew) {

        products = await Product.find().sort('-createdAt').limit(1).select('-__v');

    }
    else if (category) {

        products = await Product.find({
            categories: {
                $in: [category]
            }
        }).sort('-createdAt').select('-__v')

    }
    else products = await Product.find().sort('-createdAt').select('-__v');

    res.send(products);
});
//create a new product

router.post('/', [validator(validate), auth, admin], async (req, res) => {

    const category = await Category.findById(req.body.categoryId).select("-__v");
    if (!category) return res.status(404).send("The category with id " + req.body.categoryId + " does not exist");

    const product = new Product(req.body);
    product.category = { ...category };
    await product.save();

    res.send(product);
});


//update product
router.put('/:id', [auth, admin, objId, validator(validate)], async (req, res) => {

    const category = await Category.findById(req.body.categoryId).select("-__v");
    if (!category) return res.status(404).send("The category with id " + req.body.categoryId + " does not exist");

    const product = await Product.findByIdAndUpdate(req.params.id, {

        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        sizes: req.body.sizes,
        color: req.body.color,
        price: req.body.price,
        sex: req.body.sex,
        numberInStock: req.body.numberInStock,
        category: { ...category },

    }, { new: true });
    if (!product) return res.status(404).send('The product with the given ID was not found.');

    res.send(product);
});


//delete product
router.delete('/:id', [auth, admin, objId], async (req, res) => {
    const product = await Product.findByIdAndRemove(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');

    res.send(product);
});

//specific product
router.get('/:id', objId, async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send('The product with the given ID was not found.');

    res.send(product);
});

//same product with different properties .ie color
router.get('/variety/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("The product with id " + req.params.id + " does not exist");
    const products = await Product.find({ title: product.title });
    res.send(products);
});



module.exports = router;