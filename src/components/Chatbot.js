// src/components/Chatbot.js
import './Chatbot.css'; // Ensure your CSS path is correct
import userIcon from '../assets/user-icon.png'; // Adjust the path as needed
import serverIcon from '../assets/server-icon.png';
import { useState, useEffect } from "react"; // Import useEffect
import ListTable from "./ListTable"; // Adjust the path as needed
import Papa from 'papaparse'; // Ensure Papa Parse is installed via npm/yarn

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
                loading: true, // Indicates that this message is a loading indicator
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

                if (responseData.status === 'success') {
                    if (responseData.sql) {
                        // SQL is present; handle SQL response
                        if (Array.isArray(responseData.data)) {
                            currentFullData = responseData.data; // Store full data for this message

                            if (currentFullData.length > 20) {
                                displayedData = currentFullData.slice(0, 20); // First 20 elements
                                downloadNeeded = true;
                            } else {
                                displayedData = currentFullData; // All data
                            }

                            content = <ListTable data={displayedData} />;
                        } else {
                            // Data is not an array; handle accordingly
                            content = <p>No valid data received from server.</p>;
                        }
                    } else if (responseData.data && responseData.data.ai_response) {
                        // SQL is absent; display AI response
                        content = <p>{responseData.data.ai_response}</p>;
                    } else {
                        // Neither SQL nor AI response is present
                        content = <p>No valid data received from server.</p>;
                    }
                } else {
                    // Handle server-side errors
                    content = <p>{responseData.error || 'An error occurred.'}</p>;
                }

                // Construct the server message based on the presence of SQL
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
                    loading: false // Indicates that loading is complete
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

    // useEffect to add the initial server message when component mounts
    useEffect(() => {
        const initialMessage = {
            type: 'server',
            content: (
                <div>
                    <h4>Welcome to SCS DW Chatbot! I'm here to assist you with your queries.</h4>
                    <h4>I have below capabilities</h4> 
                    <p>1. Want to get SCS DW data? Just ask !! </p>
                    <p>2. Want to get SQL? Type /generateSql followed by your query</p>
                </div>
            ),
            loading: false // No loading indicator for static message
        };
        setMessages([initialMessage]);
    }, []); // Empty dependency array ensures this runs once on mount

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
