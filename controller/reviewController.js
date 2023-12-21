// controllers/ReviewController.js
const { Review }= require('../model/reviewModel');


const createReview = async (req, res) => {
    const {userId, bookId, comment, rating} = req.body;

    try{
        const newReview = await Review.create({userId, bookId, comment, rating });

        return res.status(201).json(newReview);
    } catch (error){
        
        return res.status(500).json({error})
    }

};

const updateReview = async (req, res) => {
    const {userId, id} = req.params;
    const {comment, rating} = req.body;

    try{
        const transaction =await Review.sequelize.transaction();

        try{
            const ReviewToUpdates = await Review.findOne({where: {userId, id}});

            if(!ReviewToUpdates){
                await transaction.rollback();
                return res.status(400).json({error: "Review not found"});
            }

            ReviewToUpdates.comment = comment || ReviewToUpdates.comment;
            ReviewToUpdates.rating = rating || ReviewToUpdates.rating;

            await ReviewToUpdates.save({transaction});

            await transaction.commit();

            return res.json(ReviewToUpdates);

        } catch (updateError){
            await transaction.rollback();
            throw updateError;
        }
    } catch (error) {
        return res.status(500).json({ error: error });
    }
 };

const deleteReview = async (req, res) => {
    
    const { id } = req.params;

    try {
        const ReviewToDelete = await Review.findOne({ where: { id } });

        if (!ReviewToDelete) {
            return res.status(404).json({ error: 'Review not found' });
        }
        ReviewToDelete.is_active = false;
        await ReviewToDelete.save();

        return res.json({ message: 'Soft deleted successfully' });
    } catch (error) {
        console.error('Error deleting Review:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    createReview,
    updateReview,
    deleteReview,
};
