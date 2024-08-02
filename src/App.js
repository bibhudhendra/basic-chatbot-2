// src/App.js
import React from 'react';
import Chatbot from './components/Chatbot';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
Amplify.configure(awsExports);

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Chatbot</h1>
            </header>
            <Chatbot />
        </div>
    );
}

export default App;
