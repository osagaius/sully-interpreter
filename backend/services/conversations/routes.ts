import express from 'express';
import { findManyConversations, findConversationLinesById } from './queries';
import { createConversation, createConversationLine } from './mutations';

const router = express.Router();

router.get('/', async (req, res) => {
    const conversations = await findManyConversations();
    res.status(200).send({ data: conversations });
});

router.post('/', async (req, res) => {
    const conversation = await createConversation(req.body);
    res.status(200).send({ data: conversation });
});

router.post('/lines/:uuid', async (req, res) => {
    const { uuid } = req.params;
    const { speaker, originalText, language, binaryData } = req.body;

    try {
        const conversationLine = await createConversationLine({
            conversationId: uuid,
            speaker,
            originalText,
            language,
            binaryData: Buffer.from(binaryData, 'base64') // Convert base64 back to binary
        });
        res.status(200).send({ data: conversationLine });
    } catch (error) {
        console.error('Error creating conversation line:', error);
        res.status(500).send({ error: 'Failed to create conversation line' });
    }
});

router.get('/lines/:conversationId', async (req, res) => {
    const { conversationId } = req.params;

    try {
        const conversationLines = await findConversationLinesById(conversationId);
        res.status(200).send({ data: conversationLines });
    } catch (error) {
        console.error('Error retrieving conversation lines:', error);
        res.status(500).send({ error: 'Failed to retrieve conversation lines' });
    }
});

export default router;
