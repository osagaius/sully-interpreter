CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    summary TEXT
);

CREATE TABLE conversation_lines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    speaker VARCHAR(50) CHECK (speaker IN ('clinician', 'patient')),
    original_text TEXT,
    translated_text TEXT,
    binary_data BYTEA,
    language VARCHAR(2) CHECK (language IN ('en', 'es')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    metadata JSONB,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conversation_id ON conversation_lines(conversation_id);
CREATE INDEX idx_conversation_timestamp ON conversation_lines(timestamp);
