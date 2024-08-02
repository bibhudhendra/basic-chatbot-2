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
                const response = await fetch('https://6o72cebd6i.execute-api.us-east-1.amazonaws.com/stage-1', {
                    method: 'POST', // or 'POST'
                    headers: {
                        'Content-Type': 'application/json',
                        // Additional headers here
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log(data); // Handle your data here
            } catch (error) {
                console.error("Failed to fetch data:", error);
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
