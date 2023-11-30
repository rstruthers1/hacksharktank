const mockKnexInstance = {
    select: jest.fn().mockResolvedValue([
        // Your mock data
        { id: 1, name: 'Role 1' },
        { id: 2, name: 'Role 2' }
        // ... other mock data
    ])
};

jest.mock('../../src/config/knex', () => {
    return () => mockKnexInstance;
});

const hackathonRoleRouter = require('../../src/routes/hackathonRoleRouter');
const request = require('supertest');
const express = require('express');

const app = express();
app.use(hackathonRoleRouter);


describe('GET /hackathon-roles', () => {
    it('responds with json', async () => {
        const res = await request(app)
            .get('/hackathon-roles')
            .expect('Content-Type', /json/)
            .expect(200);

        console.log('res.body: ', res.body)
        // Add assertions about the response
        expect(res.body).toEqual([
            { id: 1, name: 'Role 1' },
            { id: 2, name: 'Role 2' }
        ]);
    });
});
