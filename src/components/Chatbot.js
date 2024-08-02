// src/components/Chatbot.js
import React, { useState } from 'react';
import { post } from '@aws-amplify/api';
import './Chatbot.css'; // Import the CSS file

function Chatbot() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (message.trim() !== '') { // Check if message is not just empty spaces
            try {
                const response = await post('apiName', '/messages', {
                    body: { message },
                    headers: { /* any required headers */ }
                });
                // Assume response.data contains the message content you want to display
                // Adjust this line if the response structure is different
                setMessages([...messages, { content: message }]);
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div className="chat-container">
            <ul className="messages-list">
                {messages.map((msg, index) => (
                    <li key={index}>{msg.content}</li>
                ))}
            </ul>
            <div className="input-row">
                <input
                    type="text"
                    className="message-input"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button className="send-button" onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chatbot;
