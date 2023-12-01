const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const { render } = require('ejs');

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

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    reEnterPassword: String
});

const reviewSchema = new mongoose.Schema({
    pid : String,
    reviews: String,
    name:String
});

const cartSchema = new mongoose.Schema({

})

const Review = mongoose.model('Review', reviewSchema);

const User = mongoose.model('User', userSchema);

const Product = mongoose.model('Product', productSchema);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
})
app.get('/product', async (req, res) => {
    const doc = await Product.find({});
    res.render('index', { doc });



});

app.get('/product/new', (req, res) => {
    res.render('new')
})

app.get('/login', (req, res) => {
    res.render('login')
})


// app.get('/review/submit/:id/:name',async (req,res)=>{
//     // console.log('kdnokn')
//     const {id,name} = req.params;
//     const item = await Product.findById(id);

//     res.render('showNew',{item,name});
// })

// check this out
app.post('/review/submit/:pid/:name',async (req,res)=>{
    const {reviews} = req.body;
    const {pid,name} = req.params;
    // const userdata = await User.find({name:name});
    const item = await Product.findById(pid);
    const reviewData = await Review.find({})
    await Review.create({reviews,pid,name});
    res.render('showNew',{item,name,reviewData})
})

app.get('/product/:id/:name/buynow',async (req,res)=>{
    const {id,name} = req.params;
    const item = await Product.findById(id)
    res.render('UserCart',{item,name});
})

app.get('/logout',(req,res)=>{
    res.render('home')
})

app.post('/login', async (req, res) => {
    const { loginEmail, loginPassword } = req.body;
    const userdata = await User.find({email: loginEmail,password: loginPassword})
    if(userdata.length!=0){
    
        res.redirect(`newPro/${loginEmail}`)
    }
    else{
        console.log("Error")
    }
})

app.get('/cart',(req,res)=>{
    res.render('cart')
})


app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { fullName, email, password, reEnterPassword } = req.body;
    await User.create({ fullName, email, password, reEnterPassword });
    res.redirect('login')
})

app.get('/newPro/:loginEmail', async (req, res) => {
    const doc = await Product.find({});
    const loginEmail = req.params.loginEmail;
    const userdata = await User.find({email:loginEmail});
    console.log(userdata[0].fullName)
    res.render('newPro', { doc,userdata });
})

app.get('/newPro/product/:loginEmail',async (req,res)=>{
    const doc = await Product.find({});
    const loginEmail = req.params.loginEmail;
    const userdata = await User.find({email:loginEmail});
    console.log(userdata[0].fullName)
    res.render('newPro', { doc,userdata });
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

app.get('/addToCart', (req,res)=>{
    res.render('login')
})

app.get('/submitReview',(req,res)=>{
    res.redirect('login')
})

app.get('/buyNow',(req,res)=>{
    res.redirect('login')
})

app.get('/newPro/product/product/:id/:name',async (req,res)=>{
    const {id,name } = req.params;
    const pid = id;
    const doc = await Product.find({});
    const reviewData = await Review.find({})
    const item = await Product.findById(id)
    // const loginEmail = req.params.loginEmail;
    const userdata = await User.find({email:name});
    res.render('showNew',{item,name,userdata,reviewData});
})




app.get('/newPro/product/:id/:name', async (req, res) => {
    const { id , name} = req.params;
    const reviewData = await Review.find({})

    const item = await Product.findById(id);
    res.render('showNew', { item ,name,reviewData});
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


app.get('/forgetyourPassword',async (req,res)=>{
    res.render('forgetPassword')
})




app.listen(PORT, () => {
    console.log(`Server Listening on port : ${PORT}`);
});