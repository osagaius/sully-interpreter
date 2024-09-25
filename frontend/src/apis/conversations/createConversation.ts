import { CreateConversationBody } from "../../../../types";

export const createConversation = async (body: CreateConversationBody) => {
    console.log("Creating conversation with body: ", body);
    return await fetch('/api/conversations', { 
        method: 'POST', 
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}
