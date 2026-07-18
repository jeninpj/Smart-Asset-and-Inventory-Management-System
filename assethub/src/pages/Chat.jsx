import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Chat() {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        document.title = "AI Assistant | AssetHub";
        fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchHistory = async () => {
        try {
            const response = await api.get("api/chat/");
            setMessages(response.data);
        } catch (error) {
            console.log("Error fetching history:", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setIsLoading(true);

        // Optimistically add user message to UI
        const tempUserMsg = {
            id: Date.now(),
            role: "user",
            content: userMessage,
            created_at: new Date().toISOString()
        };
        setMessages((prev) => [...prev, tempUserMsg]);

        try {
            const response = await api.post("api/chat/", {
                message: userMessage,
            });

            // Add AI response to UI
            const aiMsg = {
                id: Date.now() + 1,
                role: "assistant",
                content: response.data.response,
                created_at: new Date().toISOString()
            };
            setMessages((prev) => [...prev, aiMsg]);

        } catch (error) {
            console.log(error);
            alert("Failed to get response from AI.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Sidebar />
            <Navbar />
            <div className="main-content chat-container">
                <h2>AI Asset Assistant</h2>
                <p style={{color: "#666", marginBottom: "20px"}}>
                    Ask me about your assets, inventory, or repair tickets! (History limited to last 50 messages)
                </p>

                <div className="chat-box">
                    {messages.length === 0 ? (
                        <div className="empty-chat">
                            No messages yet. Start a conversation!
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`message ${msg.role}`}
                            >
                                <div className="message-content">
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    )}
                    
                    {isLoading && (
                        <div className="message assistant">
                            <div className="message-content typing">
                                AI is thinking...
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="chat-input-form">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chat;