// src/components/Chatbot.js

import './Chatbot.css'; // Ensure your CSS path is correct
import userIcon from '../assets/user-icon.png'; // Adjust the path as needed
import serverIcon from '../assets/server-icon.png';
import { useState, useEffect } from "react"; // Import useEffect
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Import SyntaxHighlighter
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import a theme
import remarkGfm from 'remark-gfm'; // For GitHub Flavored Markdown
import rehypeSanitize from 'rehype-sanitize'; // For sanitizing HTML
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

    // Utility function to convert data array to Markdown table
    const generateMarkdownTable = (dataArray) => {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return "No data available to display.";
        }

        // Extract table headers from keys of the first object
        const headers = Object.keys(dataArray[0]);

        // Create the header row
        const headerRow = `| ${headers.join(' | ')} |`;

        // Create the separator row
        const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;

        // Create the data rows
        const dataRows = dataArray.map(row => {
            return `| ${headers.map(header => String(row[header] || '')).join(' | ')} |`;
        });

        // Combine all parts into a single Markdown table string
        return `${headerRow}\n${separatorRow}\n${dataRows.join('\n')}`;
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

                let content = '';
                let downloadNeeded = false;
                let displayedData = [];
                let currentFullData = [];
                let sqlQuery = '';

                if (responseData.status === 'success') {
                    if (Array.isArray(responseData.data)) {
                        // Handle data array response
                        currentFullData = responseData.data; // Store full data for this message

                        if (currentFullData.length > 20) {
                            displayedData = currentFullData.slice(0, 20); // First 20 elements
                            downloadNeeded = true;
                        } else {
                            displayedData = currentFullData; // All data
                        }

                        // Convert the data array to a Markdown table
                        const markdownTable = generateMarkdownTable(displayedData);

                        content = `**Here is your data:**\n\n${markdownTable}`;

                        // Extract SQL query if present
                        if (responseData.sql) {
                            sqlQuery = responseData.sql;
                        }
                    } else if (responseData.data && responseData.data.ai_response) {
                        // Handle AI response
                        let aiResponse = responseData.data.ai_response;

                        // Check and remove outer ```markdown block if present
                        if (aiResponse.startsWith('```markdown') && aiResponse.endsWith('```')) {
                            aiResponse = aiResponse.replace(/^```markdown\s*/, '').replace(/```$/, '');
                        }

                        content = aiResponse; // Assuming this is a markdown string
                    } else {
                        // Neither data array nor AI response is present
                        content = "No valid data received from server.";
                    }
                } else {
                    // Handle server-side errors
                    content = responseData.error || 'An error occurred.';
                }

                // Construct the server message based on the response type
                const serverMessage = {
                    type: 'server',
                    content: content,
                    fullData: currentFullData, // Store full data for download if needed
                    sql: sqlQuery, // Store SQL query if present
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
            content: `
# Welcome to SCS DW Chatbot!

I'm here to assist you with your queries. I have the following capabilities:

1. **Get SCS DW Data**: Just ask!
2. **Generate SQL Queries**: Type \`/generateSql\` followed by your query.
`,
            loading: false // No loading indicator for static message
        };
        setMessages([initialMessage]);
    }, []); // Empty dependency array ensures this runs once on mount

    // Custom renderer for code blocks with syntax highlighting
    const renderers = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <SyntaxHighlighter
                    style={darcula}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }
    };

    // Function to handle download link clicks
    const handleDownloadClick = (data) => {
        downloadCSV(data);
    };

    return (
        <div className="chatbot-wrapper">
            {/* Chat Container - 70% Width */}
            <div className="chat-container">
                <ul className="messages-list">
                    {messages.map((msg, index) => (
                        <li key={index} className={msg.type === 'user' ? 'user-message' : 'server-message'}>
                            {msg.type !== 'user' ? (
                                <div className="server-info">
                                    <img src={serverIcon} alt="Assistant" className="message-icon" />
                                    {msg.loading ? (
                                        <div className="spinner"></div> /* Show spinner when loading */
                                    ) : (
                                        <span className="message-content">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                rehypePlugins={[rehypeSanitize]}
                                                components={renderers}
                                            >
                                                {msg.content}
                                            </ReactMarkdown>
                                            {/* Show Download button if fullData is present and exceeds 20 entries */}
                                            {msg.fullData && msg.fullData.length > 20 && (
                                                <button
                                                    className="download-button"
                                                    onClick={() => handleDownloadClick(msg.fullData)}
                                                    aria-label="Download full data as CSV"
                                                >
                                                    Download Full Data
                                                </button>
                                            )}
                                            {/* Show Query Details if SQL is present */}
                                            {msg.sql && (
                                                <details className="details-summary">
                                                    <summary>Query Details</summary>
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm]}
                                                        rehypePlugins={[rehypeSanitize]}
                                                        components={renderers}
                                                    >
                                                        {` \`\`\`sql
${msg.sql}
\`\`\` `}
                                                    </ReactMarkdown>
                                                </details>
                                            )}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* For user messages, message-content comes first, followed by the icon */}
                                    <span className="message-content">
                                        {msg.content}
                                    </span> {/* User message content */}
                                    <img src={userIcon} alt="User" className="message-icon" />
                                </>
                            )}
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

            {/* Static Content - 30% Width */}
            <div className="static-content">
                {/* Replace the content below with your desired static HTML */}
                <h2>About This Chatbot</h2>
                <p>
                    The SCS DW Chatbot is designed to assist you in retrieving data and generating SQL queries seamlessly.
                    Whether you're looking to analyze payment terms or need help crafting complex queries, our chatbot is here to help.
                </p>
                <h3>Features:</h3>
                <ul>
                    <li>Real-time data retrieval</li>
                    <li>Automated SQL query generation</li>
                    <li>User-friendly interface</li>
                    <li>Download data as CSV</li>
                </ul>
                <h3>Contact Us:</h3>
                <p>
                    If you encounter any issues or have suggestions, feel free to reach out to our support team at <a href="mailto:support@scsdw.com">support@scsdw.com</a>.
                </p>
            </div>
        </div>
    );
}

export default Chatbot;
