import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import userIcon from '../assets/user-icon.png';
import serverIcon from '../assets/server-icon.png';

function ChatbotWebSocket() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        // Initialize the WebSocket connection
        const websocket = new WebSocket('wss://was3tadxz7.execute-api.us-east-1.amazonaws.com/production/');

        websocket.onopen = () => {
            console.log('WebSocket Connected');
        };

        websocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const serverMessage = {
                type: 'server',
                content: data.message || "No response from server.",
                sql: data.sql,
                loading: false
            };
            setMessages(messages => messages.map(msg => msg.loading ? serverMessage : msg));
        };

        websocket.onerror = (event) => {
            console.error('WebSocket Error:', event);
        };

        websocket.onclose = () => {
            console.log('WebSocket Disconnected');
            setWs(null); // Clear the WebSocket connection
        };

        setWs(websocket);

        return () => {
            websocket.close(); // Clean up WebSocket when component unmounts
        };
    }, []);

    const sendMessage = async () => {
        if (message.trim() !== '') {
            const newMessage = { type: 'user', content: message };
            setMessages(messages => [...messages, newMessage]);

            // Add a loading spinner message
            const loadingMessage = {
                type: 'server',
                content: <div className="spinner"></div>,
                loading: true,
                showIcon: true
            };
            setMessages(messages => [...messages, loadingMessage]);

            // Send message through WebSocket
            if (ws) {
                ws.send(JSON.stringify({ query: message }));
            } else {
                console.error('WebSocket not connected');
            }

            setMessage(''); // Clear the input after sending
        }
    };

    return (
        <div className="chat-container">
            <ul className="messages-list">
                {messages.map((msg, index) => (
                    <li key={index} className={msg.type === 'user' ? 'user-message' : 'server-message'}>
                        {msg.type !== 'user' ? (
                            <div className="server-info"> {/* Ensure consistent use of the flex container */}
                                <img src={serverIcon} alt="Assistant" className="message-icon left" />
                                {msg.loading ? (
                                    <div className="spinner"></div> // Only show spinner when loading
                                ) : (
                                    <span>
                                        {msg.content}
                                        <details className="details-summary">
                                            <summary>Query Details</summary>
                                            <p>{msg.sql}</p>
                                        </details>
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span>{msg.content}</span>
                        )}
                        {msg.type === 'user' ? <img src={userIcon} alt="User" className="message-icon right" /> : null}
                    </li>
                ))}
            </ul>
            <div className="input-row">
                <input
                    type="text"
                    className="message-input"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                    placeholder="Type your message..."
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default ChatbotWebSocket;
