// src/components/Chatbot.js
import './Chatbot.css'; // Ensure your CSS path is correct
import userIcon from '../assets/user-icon.png'; // Adjust the path as needed
import serverIcon from '../assets/server-icon.png';
import {useState} from "react";
import ListTable from "./ListTable"; // Adjust the path as needed

function Chatbot() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const sendMessage = async () => {
        if (message.trim() !== '') {
            const newMessage = { type: 'user', content: message };
            setMessages(messages => [...messages, newMessage]);
            setMessage('');

            // Add a loading spinner message
            const loadingMessage = {
                type: 'server',
                content: <div className="spinner"></div>, // This will display a spinner
                loading: true,
                showIcon: true // Indicates that the server icon should be shown
            };
            setMessages(messages => [...messages, loadingMessage]);

            try {
                const payload = { query: message };
                const response = await fetch('https://wd0omr8d3i.execute-api.us-east-1.amazonaws.com/prod', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const responseData = await response.json();
                const serverMessage = {
                    type: 'server',
                    content: responseData.data || "No response from server.",
                    sql: responseData.sql,
                    loading: false
                };

                // Replace the loading message with the actual server response
                setMessages(messages => messages.map(msg => msg.loading ? serverMessage : msg));
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setMessages(messages => messages.map(msg => msg.loading ? { type: 'error', content: 'Failed to send message.' } : msg));
            }
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

    function extractLists(inputString) {
        // Regular expression to match lists within square brackets
        const listRegex = /\[(.*?)\]/g;

        // Find all matches
        const matches = [...inputString.matchAll(listRegex)];

        // Process each match
        return matches.map(match => {
            // Split the content of each list by comma, trim whitespace, and remove quotes
            return match[1].split(',').map(item =>
                item.trim().replace(/^['"]|['"]$/g, '')
            );
        });
    }

    // function parseServiceResponse(data) {
    //     // Remove the first and last character (assuming they're always unwanted quotes)
    //     if (data[0] === '[') {
    //         const cleanedData = data.slice(1, -1);
    //         const stringsToRemove = ["'stringValue'", "'longValue'", "'doubleValue'", "'isNull'"];
    //         const specialCharsToRemove = ["{", "}", ":"];
    //         const processedData = removeStringsAndSpecialChars(cleanedData, stringsToRemove, specialCharsToRemove);
    //         const extractedList = extractLists(processedData);
    //         console.log("Printing the serviceResponse");
    //         console.log(messages.at(0));
    //         return (
    //             <div>
    //                 <ListTable data={extractedList}/>
    //             </div>
    //         );

    //     }
    //     return data;
    // }

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

export default Chatbot;