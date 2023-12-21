// test/bookController.test.js
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../server'); 

describe('Book Controller API Tests', () => {
    let server;

    before(() => {
        server = app.listen();
    });

    after(() => {
        server.close();
    });
    describe('POST /api/books', () => {
        it('should create a new book with transactions', async () => {
            const response = await supertest(server)
                .post('/api/books')
                .send({
                    title: 'Test Book',
                    author: 'Test Author',
                    published_year: "2022",
                    isbn: '934-4310',
                })
                .expect(201);

            expect(response.body).to.be.an('object');
            expect(response.body.title).to.equal('Test Book');
        });
    });

    describe('GET /api/books', () => {
        it('should return a list of books', async () => {
            const response = await supertest(server)
                .get('/api/books')
                .expect(200);

            expect(response.body).to.be.an('array');
        });
    });

    describe('GET /api/books/:id', () => {
        it('should return a single book by ID', async () => {
            // Assume book with ID 1 exists in the database
            const response = await supertest(server)
                .get('/api/books/6df68017-71f2-4eb6-acfa-cc8e4d05f66e')
                .expect(200);

            expect(response.body).to.be.an('object');
            expect(response.body.id).to.equal(1);
        });

        it('should return 404 for non-existent book ID', async () => {
            const response = await supertest(server)
                .get('/api/books/999')
                .expect(404);

            expect(response.body.error).to.equal('Book not found');
        });

        it('should return 400 for invalid book ID', async () => {
            const response = await supertest(server)
                .get('/api/books/invalid')
                .expect(400);

            expect(response.body.error).to.equal('Invalid book ID');
        });
    });

    describe('DELETE /api/books/:id', () => {
        it('should soft delete a book', async () => {
            // Assume book with ID 2 exists in the database
            const response = await supertest(server)
                .delete('/api/books/6df68017-71f2-4eb6-acfa-cc8e4d05f66e')
                .expect(200);

            expect(response.body.message).to.equal('Soft deleted successfully');
        });
    });
});
