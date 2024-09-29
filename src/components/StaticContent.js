// src/components/StaticContent.js

function StaticContent() {
    return (
      <div className="static-content">
        <h2>About This Chatbot</h2>
        <p>
          The SCS DW Chatbot is designed to assist you in retrieving data and generating SQL queries
          seamlessly. Whether you're looking to analyze payment terms or need help crafting complex
          queries, our chatbot is here to help.
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
          If you encounter any issues or have suggestions, feel free to reach out to our support team
          at <a href="mailto:support@scsdw.com">support@scsdw.com</a>.
        </p>
      </div>
    );
  }
  
  export default StaticContent;
  