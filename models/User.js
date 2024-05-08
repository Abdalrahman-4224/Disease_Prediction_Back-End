// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    unique_id: Number,
    email: String,
    username: String,
    password: String,
    passwordConf: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;


// models/User.js
// const { DataTypes } = require('sequelize');
// const sequelize = require('../sequelize');

// const User = sequelize.define('User', {
//   username: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   email: {
//     type: DataTypes.STRING,
//     allowNull: false,
//     unique: true
//   },
//   password: {
//     type: DataTypes.STRING,
//     allowNull: false
//   }
// });

// module.exports = User;
