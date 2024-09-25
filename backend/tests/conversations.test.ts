import request from 'supertest';
import app from '../index';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'localhost',
    database: 'sully-onsite',
    port: 5432,
});

describe('Conversations API', () => {
    beforeAll(() => {
        pool.connect();
        console.log('Connected to the database');
        console.log(pool);
    });

    afterAll(() => {
        pool.end();
    });

    it('should create a conversation', async () => {
        const res = await request(app)
            .post('/api/conversations')
            .send({});

        expect(res.status).toBe(200);
        console.log(res.body);
        expect(res.body.data).toHaveProperty('id');
    });
});

describe('POST /lines', () => {
    it('should create a conversation line and return it with binary data', async () => {
        // First, create a conversation
        const conversationRes = await request(app)
            .post('/api/conversations')
            .send({});
        const conversationId = conversationRes.body.data.id;

        // Simulate base64-encoded audio data
        const simulatedAudioBase64 = Buffer.from('Simulated audio data').toString('base64');

        // Create a conversation line with base64 binary data
        const response = await request(app)
            .post(`/api/conversations/lines/${conversationId}`)
            .send({
                speaker: 'clinician',
                originalText: 'Hello, how can I help you?',
                language: 'en',
                binaryData: simulatedAudioBase64 // Base64-encoded binary data
            });

        // Verify the response
        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('id');

        // Optionally, verify the binary data is stored
        expect(response.body.data).toHaveProperty('binary_data');
        expect(response.body.data).toHaveProperty('original_text');
        expect(response.body.data).toHaveProperty('language');
    });
});
