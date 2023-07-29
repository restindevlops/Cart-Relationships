const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products =>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });    
  })
  .catch(err => console.log(err));

};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({where:{id:prodId}})

  .then(product=>{
    res.render('shop/product-detail', {
      product: product[0],
      pageTitle: product[0].title,
      path: '/products'
  })
})
.catch(err => console.log(err))

};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then(products=> {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
  });
})
.catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
req.user
.getCart()
.then(cart=>{
  return cart
  .getProducts()
  .then(products =>{
    res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
  })
})
.catch(err =>{console.log(err)})
})
.catch(err =>{console.log(err)})


};

exports.postCart = (req, res, next) => {

  const prodId = req.body.productId; // getting the id of the particular product
  let fetchedCart;
  let newQuantity =1; 
  req.user
  .getCart() // getting the cart of the particular user
  .then(cart =>{
    fetchedCart= cart;  // the user's cart is stored as fetched cart

    return cart.getProducts({where: { id :prodId}}) // fetching the product with the particular prodId from the cart. getProducts always returns an array
  })
  .then(products =>{ // products is the returned array.
    let product;
    if(products.length>0){ // if such a product is in the cart already before.
      product=products[0]; 
    }
   
    if(product){

      const oldQuantity= product.cartItem.quantity // getting the previous quantity of the product in the cart
      newQuantity= oldQuantity+1; // increasing the quantity by 1.
      return product;

    }
    return Product.findByPk(prodId)// if the product is not in the cart before the product is searched in the product table
  })
    .then(product =>{
      return fetchedCart.addProduct(product, 
        { through : {quantity : newQuantity}}) // adding the product from the product table to the cart by changing its quantity to 1
    })

  .then(()=>{
    res.redirect('/cart')

  })
  .catch(err => {console.log(err)})

  
};

exports.postCartDeleteProduct = (req, res, next) => {

  const prodId = req.body.productId;
  let fetchedCart;
  req.user
  .getCart() // getting the cart of the particular user
  .then(cart =>{

    return cart.getProducts({where: { id :prodId}}) // fetching the product with the particular prodId from the cart. getProducts always returns an array
  })
  .then(products =>{ // products is the returned array.

      const product=products[0]; 
    
    return product.cartItem.destroy(); // deleting the particular product from the intermediate table cartItem 
  })
  .then(()=>{
    res.redirect('/cart');
  })
  .catch(err => {console.log(err)})


};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
