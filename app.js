const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize= require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-items');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{ // a middleware to store user in a request so that to use it anywhere convinently..

    User.findByPk(1) // retrieving the user with id= 1
    .then(user =>{ // storing the retrieved object as user

        req.user= user; // user is not a js object but a sequleize object with all of the sequelize properties and functions
        next();
    })
    .catch(err=>{console.log(err)})

})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{ constraints : true , onDelete: 'CASCADE'});  // Product is related to User such that each user has created the Product
//and CASCADE allows that if the user is deleted his products are also deleted.

User.hasMany(Product) // A user can have many products in his shop. The product table is therefore connected to use table with a 
//foreign key known as 'userId'

User.hasOne(Cart); // A user always has his cart
Cart.belongsTo(User); // Inverse of the above relation where a cart is related to User such that each user has its own cart

Cart.belongsToMany(Product, {through : CartItem}); // One cart can hold multiple products. Both are connected through an intermediate table 'cartItem' that contain cartId and productId 
Product.belongsToMany(Cart, {through : CartItem}) // A product can be a part of multiple carts.

sequelize
//  .sync({force  : true}) // force : true is used at the time of development as it deletes any older tables with the same names 
// and creates new tables with the specified name.

.sync()
.then(result =>{

    return User.findByPk(1); // Finding the User with the id =1. 
})

.then(user=>{ // .then() is from the promise of User.findByPk(1)

if(!user){ // if there is no user with the id=1
  return  User.create({name: 'Tom', email : 'tom@gmail.com'}) // creating a dummy user that will get id=1 upon creation
}

return user; // returning the user wrapped up as a promise
})

.then(user =>{     // .then() is of the user
    // console.log(user);
    return user.createCart(); // creating a dummy cart for the user
    
}) 
.then( cart=>{
    app.listen(3000);
    
})


.catch(err=> console.log(err));