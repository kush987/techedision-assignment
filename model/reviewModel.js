const {DataTypes} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const {sequelize} = require('../config/db');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    userId:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    bookId:{
        type: DataTypes.UUID,
        allowNull: false,
    },
    comment:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    rating:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue: true
    },
},{
    hooks:{
        beforeCreate:(review) =>{
            review.id = uuidv4();
        },
    },
},{
    tableName:'Reviews'
});

module.exports = {Review};