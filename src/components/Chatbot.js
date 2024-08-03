// src/components/Chatbot.js
import React, { useEffect, useState } from 'react';
import './Chatbot.css'; // Make sure this path is correct

function Chatbot() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (message.trim() !== '') { // Check if message is not just empty spaces
            const newMessage = {
                type: 'user',
                content: message
            };

            // Display user message immediately in the chat window
            setMessages(messages => [...messages, newMessage]);

            try {
                const payload = { query: message };
                const response = await fetch('https://6o72cebd6i.execute-api.us-east-1.amazonaws.com/stage-1', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const responseData = await response.json();
                console.log(responseData)
                const serverMessage = {
                    type: 'server',
                    content: responseData.body || "No response from server." // Adjust the key according to your response structure
                };

                // Update messages with the response from the server
                setMessages(messages => [...messages, serverMessage]);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setMessages(messages => [...messages, { type: 'error', content: 'Failed to send message.' }]);
            }

            // Clear the input after sending
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <ul className="messages-list">
                {messages.map((msg, index) => (
                    <li key={index} className={msg.type === 'user' ? 'user-message' : 'server-message'}>
                        {msg.content}
                    </li>
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
