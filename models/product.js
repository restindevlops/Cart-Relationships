const Sequelize=require('sequelize');

const sequelize= require('../util/database');

const Product = sequelize.define('product',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    autoNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price:{
    type: Sequelize.DOUBLE,
    autoNull: false
  },
  imageURL :{
    type: Sequelize.STRING,
    autoNull: false
  },
  description:{
    type: Sequelize.STRING,
    autoNull: false
  }
});

module.exports=Product;