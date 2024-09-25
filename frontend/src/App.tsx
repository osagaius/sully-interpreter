import { Route, Routes } from 'react-router-dom';
import ChatDialog from './containers/ChatDialog';
import { createConversation } from "./apis";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const handleNewConversation = async () => {
    try {
      const response = await createConversation({ conversation: {} });
      const newConversation = await response.json();
      const newConversationId = newConversation.data?.id; 
      // Redirect to the new conversation
      navigate(`/chats/${newConversationId}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "1rem" }}>
        <h1 style={{ alignContent: "center" }}>Patient Chats Dashboard</h1>
      </div>
      <div>
      <button onClick={handleNewConversation}>Start New Conversation</button>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div>
        <Routes>
          <Route path="/chats/:uuid" element={<ChatDialog />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
