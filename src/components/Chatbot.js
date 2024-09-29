// src/components/Chatbot.js

import './Chatbot.css';
import { useState, useEffect } from 'react';
import MessageList from './MessageList';
import InputRow from './InputRow';
import StaticContent from './StaticContent';
import { downloadCSV } from '../utils/csvUtils';
import { generateMarkdownTable } from '../utils/markdownUtils';
import { renderers } from '../utils/renderers';
import { initialMessage } from '../constants/messages';

function Chatbot() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Include the sendMessage function here
  const sendMessage = async () => {
    if (message.trim() !== '') {
      // Add user message to the messages state
      const newMessage = { type: 'user', content: message };
      setMessages((messages) => [...messages, newMessage]);
      setMessage('');

      // Add a loading spinner message
      const loadingMessage = {
        type: 'server',
        content: <div className="spinner"></div>, // Spinner component
        loading: true, // Indicates that this message is a loading indicator
        showIcon: true, // Indicates that the server icon should be shown
      };
      setMessages((messages) => [...messages, loadingMessage]);

      try {
        const payload = { query: message };
        const response = await fetch('https://wd0omr8d3i.execute-api.us-east-1.amazonaws.com/prod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const responseData = await response.json();

        let content = '';
        let currentFullData = [];
        let displayedData = [];
        let sqlQuery = '';

        if (responseData.status === 'success') {
          if (Array.isArray(responseData.data)) {
            currentFullData = responseData.data;

            if (currentFullData.length > 20) {
              displayedData = currentFullData.slice(0, 20);
            } else {
              displayedData = currentFullData;
            }

            const markdownTable = generateMarkdownTable(displayedData);
            content = `**Here is your data:**\n\n${markdownTable}`;

            if (responseData.sql) {
              sqlQuery = responseData.sql;
            }
          } else if (responseData.data && responseData.data.ai_response) {
            let aiResponse = responseData.data.ai_response;

            if (aiResponse.startsWith('```markdown') && aiResponse.endsWith('```')) {
              aiResponse = aiResponse.replace(/^```markdown\s*/, '').replace(/```$/, '');
            }

            content = aiResponse;
          } else {
            content = 'No valid data received from server.';
          }
        } else {
          content = responseData.error || 'An error occurred.';
        }

        const serverMessage = {
          type: 'server',
          content: content,
          fullData: currentFullData,
          sql: sqlQuery,
          loading: false,
        };

        // Replace the loading message with the actual server response
        setMessages((messages) => messages.map((msg) => (msg.loading ? serverMessage : msg)));
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Replace the loading message with an error message
        setMessages((messages) =>
          messages.map((msg) =>
            msg.loading
              ? { type: 'error', content: 'Failed to send message. Please try again.' }
              : msg
          )
        );
      }
    }
  };

  useEffect(() => {
    setMessages([initialMessage]);
  }, []);

  const handleDownloadClick = (data) => {
    downloadCSV(data);
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chat-container">
        <MessageList
          messages={messages}
          handleDownloadClick={handleDownloadClick}
          renderers={renderers}
        />
        <InputRow message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <StaticContent />
    </div>
  );
}

export default Chatbot;
