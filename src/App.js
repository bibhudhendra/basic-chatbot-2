// src/App.js
import React from 'react';
import Chatbot from './components/Chatbot';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import logo from './assets/chatbot_1.jpeg';
Amplify.configure(awsExports);

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Analytics Buddy</h1>
                <img src={logo} alt="Analytics Buddy Logo" />
            </header>
            <Chatbot />
        </div>
    );
}

export default App;
