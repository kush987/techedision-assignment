const {DataTypes} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const {sequelize} = require('../config/db');
const {Review} = require('./reviewModel');

const User = sequelize.define('User', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue: true
    },

},{
    hooks:{
        beforeCreate:(user) =>{
            user.userId = uuidv4();
        },
    },
},{
    tableName:'Users'
});

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

module.exports = {User};