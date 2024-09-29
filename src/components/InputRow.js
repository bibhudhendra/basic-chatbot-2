// src/components/InputRow.js

function InputRow({ message, setMessage, sendMessage }) {
    return (
      <div className="input-row">
        <input
          type="text"
          className="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type your message..."
        />
        <button className="send-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    );
  }
  
  export default InputRow;
  