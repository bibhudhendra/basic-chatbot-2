// src/components/Chatbot.js
import './Chatbot.css'; // Ensure your CSS path is correct
import userIcon from '../assets/user-icon.png'; // Adjust the path as needed
import serverIcon from '../assets/server-icon.png';
import { useState } from "react";
import ListTable from "./ListTable"; // Adjust the path as needed
import Papa from 'papaparse'; // Import Papa Parse

function Chatbot() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Function to download CSV, accepts data as a parameter
    const downloadCSV = (data) => {
        if (!data || data.length === 0) {
            alert("No data available to download.");
            return;
        }

        // Use Papa Parse to convert JSON to CSV
        const csv = Papa.unparse(data);

        // Create a Blob from the CSV string
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // Create a link to download the Blob
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Optional: Notify the user of successful download
        alert("CSV file has been downloaded successfully.");
    };

    const sendMessage = async () => {
        if (message.trim() !== '') {
            // Add user message to the messages state
            const newMessage = { type: 'user', content: message };
            setMessages(messages => [...messages, newMessage]);
            setMessage('');

            // Add a loading spinner message
            const loadingMessage = {
                type: 'server',
                content: <div className="spinner"></div>, // Spinner component
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

                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }

                const responseData = await response.json();

                let content;
                let downloadNeeded = false;
                let displayedData = [];
                let currentFullData = [];

                if (responseData.status === 'success' && Array.isArray(responseData.data)) {
                    currentFullData = responseData.data; // Store full data for this message
                    console.log(`Full data length: ${currentFullData.length}`); // Log for debugging

                    if (currentFullData.length > 20) {
                        displayedData = currentFullData.slice(0, 20); // First 20 elements
                        downloadNeeded = true;
                        console.log(`Displayed data length: ${displayedData.length}`); // Log for debugging
                    } else {
                        displayedData = currentFullData; // All data
                        console.log(`Displayed data length: ${displayedData.length}`); // Log for debugging
                    }

                    content = <ListTable data={displayedData} />;
                } else {
                    content = "No valid data received from server.";
                }

                const serverMessage = {
                    type: 'server',
                    content: (
                        <div>
                            {content}
                            {downloadNeeded && (
                                <button
                                    className="download-button"
                                    onClick={() => downloadCSV(currentFullData)}
                                    aria-label="Download full data as CSV"
                                >
                                    Download Full Data
                                </button>
                            )}
                        </div>
                    ),
                    sql: responseData.sql,
                    loading: false
                };

                // Replace the loading message with the actual server response
                setMessages(messages => messages.map(msg => msg.loading ? serverMessage : msg));
            } catch (error) {
                console.error("Failed to fetch data:", error);
                // Replace the loading message with an error message
                setMessages(messages => messages.map(msg => 
                    msg.loading ? { type: 'error', content: 'Failed to send message. Please try again.' } : msg
                ));
            }
        }
    };

    return (
        <div className="chat-container">
            <ul className="messages-list">
                {messages.map((msg, index) => (
                    <li key={index} className={msg.type === 'user' ? 'user-message' : 'server-message'}>
                        {msg.type !== 'user' ? (
                            <div className="server-info">
                                <img src={serverIcon} alt="Assistant" className="message-icon left" />
                                {msg.loading ? (
                                    <div className="spinner"></div> // Show spinner when loading
                                ) : (
                                    <span>
                                        {msg.content}
                                        {msg.sql && (
                                            <details className="details-summary">
                                                <summary>Query Details</summary>
                                                <pre>{msg.sql}</pre> {/* Display SQL query */}
                                            </details>
                                        )}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span>{msg.content}</span> // User message content
                        )}
                        {msg.type === 'user' && <img src={userIcon} alt="User" className="message-icon right" />}
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