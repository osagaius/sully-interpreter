import { FC, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ChatDialog: FC = () => {
    const { uuid } = useParams<{ uuid: string }>();
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [lastMessage, setLastMessage] = useState<any | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [conversationLines, setConversationLines] = useState<any[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.ondataavailable = async (event) => {
            const audioBlob = event.data;
            const arrayBuffer = await audioBlob.arrayBuffer();
            const base64Audio = arrayBufferToBase64(arrayBuffer);
            await sendAudioToServer(base64Audio);
        };

        recorder.start();
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        const binary = String.fromCharCode(...new Uint8Array(buffer));
        return window.btoa(binary);
    };

    const sendAudioToServer = async (base64Audio: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:5173/api/conversations/lines/${uuid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId: uuid,
                    binaryData: base64Audio
                }),
            });
            const data = await response.json();
            const lastMessage = data.data;
            setLastMessage(lastMessage);
            console.log("last message", lastMessage);
            if (lastMessage && lastMessage.binary_data) {
                const audioBlob = new Blob([new Uint8Array(lastMessage.binary_data.data)], { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                console.log("setting audio url", url);
                setAudioUrl(url);
            }
            fetchConversationLines(); // Fetch updated conversation lines
        } catch (error) {
            console.error("Failed to send audio", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConversationLines = async () => {
        try {
            const response = await fetch(`http://localhost:5173/api/conversations/lines/${uuid}`);
            const data = await response.json();
            setConversationLines(data.data);
        } catch (error) {
            console.error("Failed to fetch conversation lines", error);
        }
    };

    useEffect(() => {
        fetchConversationLines(); // Fetch conversation lines on component mount

        return () => {
            if (mediaRecorder) {
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
            }
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [mediaRecorder, audioUrl]);

    return (
        <dialog open style={{ minWidth: "800px", display: "flex" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", borderRight: "1px solid #ccc", padding: "20px" }}>
                <h2>Press to Speak</h2>
                <button onClick={isRecording ? stopRecording : startRecording} disabled={isLoading} style={{ marginTop: "20px" }}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
                {isLoading && <p>Sending audio...</p>}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
                <h2>Translation</h2>
                {lastMessage ? (
                    <div>
                        {audioUrl && (
                            <audio controls autoPlay src={audioUrl}></audio>
                        )}
                        <p><strong>Language:</strong> {lastMessage.language}</p>
                        <p><strong>Original Text:</strong> {lastMessage.original_text}</p>
                        <p><strong>Translated Text:</strong> {lastMessage.translated_text}</p>
                    </div>
                ) : (
                    <p>No messages yet.</p>
                )}
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
                <h2>Conversation History</h2>
                {conversationLines.length > 0 ? (
                    conversationLines.map((line) => {
                        const displayText = line.language === 'es' ? line.translated_text : line.original_text;
                        return (
                            <div key={line.id}>
                                <p><strong>{new Date(line.timestamp).toLocaleString()}:</strong> {displayText}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No conversation history available.</p>
                )}
            </div>
        </dialog>
    );
};

export default ChatDialog;
