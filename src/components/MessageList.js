// src/components/MessageList.js

import MessageItem from './MessageItem';

function MessageList({ messages, handleDownloadClick, renderers }) {
  return (
    <ul className="messages-list">
      {messages.map((msg, index) => (
        <MessageItem
          key={index}
          msg={msg}
          handleDownloadClick={handleDownloadClick}
          renderers={renderers}
        />
      ))}
    </ul>
  );
}

export default MessageList;
