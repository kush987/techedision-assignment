// controllers/bookController.js
const {Book }= require('../model/bookModel');
const {Review} = require('../model/reviewModel');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 300 });

const getAllBooks = async (req, res) => {
    const { page = 1, limit = 10, author, genre, publicationYear } = req.query;
    const cacheKey = `getAllBooks_${page}_${limit}_${author}_${genre}_${publicationYear}`;
    try {

        const cachedData = cache.get(cacheKey);
        if (cachedData) {
            console.log('Data retrieved from cache');
            return res.json(cachedData);
        }
        // Build the filter conditions based on query parameters
        const filterConditions = {
            is_active: true,
        };
        if (author) filterConditions.author = author;
        if (genre) filterConditions.genre = genre;
        if (publicationYear) filterConditions.published_year = publicationYear;

        // Paginate the results
        const offset = (page - 1) * limit;
        const books = await Book.findAll({
            where: filterConditions,
            offset,
            limit: parseInt(limit),
        });
        cache.set(cacheKey, books);

        return res.json(books);
    } catch (error) {
        console.error('Error retrieving books:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getSingleBook = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the book by ID
        const book = await Book.findByPk(id, {
            include: [{
                model: Review,
                attributes: ['id', 'userId','comment', 'rating'],
            }],
        });

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        return res.json(book);
    } catch (error) {
        console.error('Error retrieving book:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

const createBook = async (req, res) => {
    const {title, author, published_year, isbn} = req.body;
    console.log("Request---->>",req.body)
    try{
        const existingBook = await Book.findOne({where: { isbn }});
        if(existingBook){
            return res.status(400).json({error:'ISBn must be unique'});
        }
        
        const newBook = await Book.create({title, author, published_year, isbn });

        return res.status(201).json(newBook);
    } catch (error){
        console.log("error--->>",error)
        return res.status(500).json({error})
    }

};

const updateBook = async (req, res) => {
    const {id} = req.params;
    const {title, author, published_year, isbn} = req.body;

    try{
        const transaction =await Book.sequelize.transaction();

        try{
            const bookToUpdates = await Book.findOne({where: {id}});

            if(!bookToUpdates){
                await transaction.rollback();
                return res.status(400).json({error: "Book not found"});
            }

            bookToUpdates.title = title || bookToUpdates.title;
            bookToUpdates.author = author || bookToUpdates.author;
            bookToUpdates.published_year = published_year || bookToUpdates.published_year;
            bookToUpdates.isbn = isbn || bookToUpdates.isbn;

            await bookToUpdates.save({transaction});

            await transaction.commit();

            return res.json(bookToUpdates);

        } catch (updateError){
            await transaction.rollback();
            throw updateError;
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
 };

const deleteBook = async (req, res) => {
    
    const { id } = req.params;

    try {
        // Find the book to delete
        const bookToDelete = await Book.findOne({ where: { bookId:id } });

        if (!bookToDelete) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Soft delete the book by updating the is_active field
        bookToDelete.is_active = false;
        await bookToDelete.save();

        return res.json({ message: 'Soft deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllBooks,
    getSingleBook,
    createBook,
    updateBook,
    deleteBook,
};
