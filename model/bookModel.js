const {DataTypes} = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const {sequelize} = require('../config/db');
const {Review} = require('./reviewModel');

const Book = sequelize.define('Book', {
    bookId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    author:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    published_year:{
        type:DataTypes.INTEGER,
        allowNull: false
    },
    isbn:{
        type:DataTypes.STRING,
        allowNull: false,
        unique:true
    },
    is_active:{
        type:DataTypes.BOOLEAN,
        defaultValue: true
    },

},{
    hooks:{
        beforeCreate:(book) =>{
            book.bookId = uuidv4();
        },
    },
},{
    tableName:'Books'
});

Book.hasMany(Review, { foreignKey: 'bookId' });
Review.belongsTo(Book, { foreignKey: 'bookId' });

module.exports = {Book};