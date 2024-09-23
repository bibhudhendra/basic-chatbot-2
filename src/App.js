// src/App.js
import React from 'react';
import Chatbot from './components/Chatbot';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import logo from './assets/chatbot_1.jpeg';
Amplify.configure(awsExports);

function App() {
    const handleContactClick = () => {
        // Open a new tab with the desired URL
        window.open('https://sim.amazon.com/issues/create?assignedFolder=62c95db4-b402-4ff6-856b-af34d57c36a9', '_blank');
    };
    return (
        <div className="App">
            <header className="App-header">
                <div className="App-logo-title">
                    <h1>Analytics Buddy</h1>
                    <img src={logo} alt="Analytics Buddy Logo" />
                </div>
                <button onClick={handleContactClick} className="contact-button">
                    Contact to SCS Team
                </button>
            </header>
            <Chatbot />
        </div>
    );
}

export default App;
