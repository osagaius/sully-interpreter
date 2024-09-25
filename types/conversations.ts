export type Conversation = {
    id: string; // UUID for the conversation
    start_time: Date; // Start time of the conversation
    end_time?: Date; // Optional end time
    summary?: string; // Summary of the conversation
};

export interface CreateConversationLineBody {
    conversationId: string;
    speaker: 'clinician' | 'patient';
    originalText: string;
    translatedText?: string; // optional for input
    language: 'en' | 'es';
    binaryData?: Buffer; // Assuming binary data is a Buffer
}

export interface ConversationLine {
    id: string;
    conversation_id: string;
    speaker: string;
    original_text: string;
    translated_text: string;
    language: string;
    timestamp: Date;
}

// Query types for finding multiple conversations
export type FindManyConversationsQuery = {
    conversationIds?: string[]; // Array of conversation UUIDs
};

// Body type for creating a conversation
export type CreateConversationBody = {
    conversation: Omit<Conversation, 'id' | 'start_time' | 'end_time'>; // Omit fields not needed for creation
};

// Update body type for a conversation
export type UpdateConversationBody = {
    conversation: Omit<Conversation, 'start_time' | 'end_time' | 'id'>; // Omit fields not needed for updates
};

// Parameters for updating a specific conversation
export type UpdateConversationParams = {
    conversationId: string; // UUID of the conversation to update
};
