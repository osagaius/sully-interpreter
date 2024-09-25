import { getPgClient } from "../../db";
import { CreateConversationBody, Conversation } from "../../../types";
import { CreateConversationLineBody, ConversationLine } from "../../../types";
import { createClient } from "@deepgram/sdk";
import fs from 'fs';
import path from 'path';
import { Translate } from "@google-cloud/translate/build/src/v2";

const pgClient = getPgClient();
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
const translate = new Translate({ key: process.env.GOOGLE_TRANSLATE_API_KEY });

export const createConversation = async (body: CreateConversationBody) => {
    const { conversation } = body;
    const newConversation = await pgClient.query<Conversation>({ name: 'createConversation', text: 'INSERT INTO conversations DEFAULT VALUES RETURNING *' })
    return newConversation.rows[0];
}

const getAudioBuffer = async (response: ReadableStream) => {
    const reader = response.getReader();
    const chunks = [];

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
    }

    const dataArray = chunks.reduce(
        (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
        new Uint8Array(0)
    );

    return Buffer.from(dataArray.buffer);
};

const getAudioFromText = async (text: string) => {
    const response = await deepgram.speak.request(
        { text },
        {
            model: "aura-zeus-en",
            encoding: "linear16",
            container: "wav",
        }
    );

    const stream = await response.getStream();
    if (stream) {
        return await getAudioBuffer(stream);
    } else {
        throw new Error("Failed to generate audio.");
    }
};

export const createConversationLine = async (body: any) => {
    const { conversationId, speaker, binaryData, language } = body;

    try {
        const audioBuffer = Buffer.from(binaryData, 'base64');

        const transcriptionResponse = await deepgram.listen.prerecorded.transcribeFile(
            audioBuffer,
            {
                model: "nova-2",
                detect_language: true
            }
        );

        const originalText = transcriptionResponse.result?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
        const detectedLanguage = transcriptionResponse.result?.results?.channels?.[0]?.detected_language;
        console.log('detectedLanguage', detectedLanguage);

        if (!originalText) {
            throw new Error("Original text is undefined.");
        }

        const [translatedText] = await translate.translate(originalText, detectedLanguage === 'es' ? 'en' : 'es');
        console.log(`Translated text: ${translatedText}`);

        const audioFromTextBuffer = await getAudioFromText(translatedText);

        // TODO Refactor out - (Ensure the audio directory exists)
        const audioDir = path.join(__dirname, '../../audio'); // Adjust path as necessary
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true }); // Create the directory if it doesn't exist
        }

        // Save the audio buffer to a file
        const filePath = path.join(audioDir, `${conversationId}.wav`); // Use the UUID for the filename
        fs.writeFileSync(filePath, audioFromTextBuffer);
        console.log(`Audio saved to ${filePath}`);

        const newConversationLine = await pgClient.query({
            text: `
                INSERT INTO conversation_lines (conversation_id, speaker, original_text, translated_text, language, binary_data)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            values: [conversationId, speaker, originalText, translatedText, detectedLanguage, audioFromTextBuffer],
        });

        return newConversationLine.rows[0];

    } catch (error) {
        throw new Error("Failed to create conversation line" + error);
    }
};
