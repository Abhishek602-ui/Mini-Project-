const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
// const data = require('./dummy');
const methodOverride = require('method-override');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/CB-Hackathon');
    console.log("DB Connected");
}

const productSchema = new mongoose.Schema({
    title: String, // String is shorthand for {type: String}
    description: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    category: String,
    thumbnail: String,
    images: [String]
});

const Product = mongoose.model('Product', productSchema);

//   Product.insertMany()
//     .then(()=>{
//         console.log("Data inserted");
//     }).catch((err)=>console.log(err));



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req,res)=>{
    res.render('home');
})
app.get('/product', async (req, res) => {
    const doc = await Product.find({});
    res.render('index', { doc });



});

app.get('/product/new', (req, res) => {
    res.render('new')
})

app.post('/product', async (req, res) => {
    const { title, description, discountPercentage, brand, category, price, thumbnail } = req.body;
    await Product.create({ title, description, discountPercentage, brand, category, price, thumbnail });
    res.redirect('product')
});

app.get('/product/:id', async (req, res) => {
    const { id } = req.params;
    const item = await Product.findById(id);
    res.render('show', { item });
});

app.get('/product/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('edit', { product });
});

app.patch('/product/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, discountPercentage, brand, category, price, thumbnail } = req.body;
    const product = await Product.findById(id);


    product.title = title;
    product.description = description;
    product.discountPercentage = discountPercentage;
    product.brand = brand;
    product.category = category;
    product.price = price;
    product.thumbnail = thumbnail;

    await product.save();
    res.redirect('/product');
});


app.delete('/product/:id', async (req, res) => {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);

    res.redirect('/product');
});

app.listen(PORT, () => {
    console.log(`Server Listening on port : ${PORT}`);
});