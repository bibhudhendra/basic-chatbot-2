// src/components/MessageItem.js

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import userIcon from '../assets/user-icon.png';
import serverIcon from '../assets/server-icon.png';

function MessageItem({ msg, handleDownloadClick, renderers }) {
  return (
    <li className={msg.type === 'user' ? 'user-message' : 'server-message'}>
      {msg.type !== 'user' ? (
        <div className="server-info">
          {msg.showIcon && <img src={serverIcon} alt="Assistant" className="message-icon" />}
          {msg.loading ? (
            <div className="spinner"></div>
          ) : (
            <span className="message-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
                components={renderers}
              >
                {msg.content}
              </ReactMarkdown>
              {msg.fullData && msg.fullData.length > 20 && (
                <button
                  className="download-button"
                  onClick={() => handleDownloadClick(msg.fullData)}
                  aria-label="Download full data as CSV"
                >
                  Download Full Data
                </button>
              )}
              {msg.sql && (
                <details className="details-summary">
                  <summary>Query Details</summary>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                    components={renderers}
                  >
                    {` \`\`\`sql\n${msg.sql}\n\`\`\` `}
                  </ReactMarkdown>
                </details>
              )}
            </span>
          )}
        </div>
      ) : (
        <>
          <span className="message-content">{msg.content}</span>
          <img src={userIcon} alt="User" className="message-icon" />
        </>
      )}
    </li>
  );
}

export default MessageItem;
