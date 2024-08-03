// src/components/Chatbot.js
import React, { useState } from 'react';
import './Chatbot.css'; // Ensure your CSS path is correct
import userIcon from '../assets/user-icon.png'; // Adjust the path as needed
import serverIcon from '../assets/server-icon.png'; // Adjust the path as needed

function Chatbot() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (message.trim() !== '') {
            const newMessage = { type: 'user', content: message };

            setMessages(messages => [...messages, newMessage]);
            setMessage('');

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
                console.log(responseData);
                const serverMessage = {
                    type: 'server',
                    content: parseServiceResponse(responseData.body) || "No response from server.",
                    sql: responseData.sql
                };
                console.log(serverMessage);

                setMessages(messages => [...messages, serverMessage]);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setMessages(messages => [...messages, { type: 'error', content: 'Failed to send message.' }]);
            }

            setMessage('');
        }
    };

    function removeStringsAndSpecialChars(originalString, stringsToRemove, specialCharsToRemove) {
        // Escape special characters in the strings to remove
        const escapedStrings = stringsToRemove.map(str =>
            str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );

        // Create a regular expression for strings to remove
        const stringsRegex = new RegExp(escapedStrings.join('|'), 'g');

        // Create a regular expression for special characters to remove
        const specialCharsRegex = new RegExp(`[${specialCharsToRemove.join('')}]`, 'g');

        // First, remove the specified strings
        let result = originalString.replace(stringsRegex, '');
        // result = result.replace(/\],/g, ']\n');

        // Then, remove the special characters
        result = result.replace(specialCharsRegex, '');
        console.log(result);
        return result;
    }

    function parseServiceResponse(data) {
        // Remove the first and last character (assuming they're always unwanted quotes)
        const cleanedData = data.slice(1, -1);
        const stringsToRemove = ["'stringValue'", "'longValue'", "'thirdValue'"];
        const specialCharsToRemove = ["{", "}", ":"];
        return removeStringsAndSpecialChars(cleanedData, stringsToRemove, specialCharsToRemove);
    }

    return (
        <div className="chat-container">
            <ul className="messages-list">
                {messages.map((msg, index) => (
                    <li key={index} className={msg.type === 'user' ? 'user-message' : 'server-message'}>
                        {msg.type !== 'user'? (<span>{msg.content}
                            <details>
                                <summary>Details</summary>
                                <p>{msg.sql}</p>
                            </details>
                        </span>
                            ):
                            (<span>{msg.content}</span>)}

                        {msg.type === 'user' ? <img src={userIcon} alt="User" className="message-icon right" /> :
                            <img src={serverIcon} alt="Assistant" className="message-icon left" />}
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
