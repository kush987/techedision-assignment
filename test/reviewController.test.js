// test/bookController.test.js
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server'); 

describe('Review Controller API Tests', () => {
    let server;

    before(() => {
        server = app.listen();
    });

    after(() => {
        server.close();
    });
    describe('POST /api/reviews', () => {
        it('should create a review of books', async () => {
            const response = await supertest(server)
                .post('/api/reviews')
                .send({
                    userId:"adsgfdasfas",
                    bookId:"fd62f299-2c58-452b-902b-0a9da37e6cfa",
                    comment:"this is great books for kid",
                    rating: 4
                })
                .expect(201);

            expect(response.body).to.be.an('object');
            expect(response.body.title).to.equal('Test Review');
        });
    });

    describe('PUT /api/reviews/:userId/:id', () => {
        it('should update the review', async () => {
            const response = await supertest(server)
                .get('/api/reviews/adsgfdasfas/fd62f299-2c58-452b-902b-0a9da37e6cfa')
                .expect(200);

            expect(response.body).to.be.an('array');
        });
    });

    describe('DELETE /api/reviews/:id', () => {
        it('should soft delete a review', async () => {
            
            const response = await supertest(server)
                .delete('/api/reviews/fd62f299-2c58-452b-902b-0a9da37e6cfa')
                .expect(200);

            expect(response.body.message).to.equal('Soft deleted successfully');
        });
    });
});
