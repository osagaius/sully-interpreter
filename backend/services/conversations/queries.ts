import { getPgClient } from "../../db";
import { Conversation, ConversationLine } from "../../../types";

const pgClient = getPgClient();

export const findManyConversations = async () => {
    return (await pgClient.query({ name: 'findManyConversations', text: 'SELECT * FROM conversations' })).rows;
}

export const findConversationLinesById = async (conversationId: string) => {
    const query = `
        SELECT cl.*, c.id AS conversation_id
        FROM conversation_lines cl
        JOIN conversations c ON cl.conversation_id = c.id
        WHERE c.id = $1
        ORDER BY cl.timestamp DESC
    `;

    const result = await pgClient.query({
        name: 'findConversationLinesById',
        text: query,
        values: [conversationId], // Pass the conversation ID here
    });

    return result.rows;
};
