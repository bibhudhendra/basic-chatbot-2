// src/components/StaticContent.js

function StaticContent() {
    return (
      <div className="static-content">
        <h2>About This Chatbot</h2>
        <p>
          The SCS DW Chatbot is designed to assist you in retrieving data and generating SQL queries
          seamlessly.
        </p>
        <h3>Capabilities:</h3>
        <ul>
          <li>Real-time data retrieval from SCS DW (scsdatalake redshift cluster)</li>
          <li>Download data as CSV/Excel</li>
          <li>Want to get just SQL for DW query? Type /dw-sql followed by query</li>
          <li>Have context of SCS RDS. Type /rds followed by query</li>
        </ul>
        <h3>Upcoming Features</h3>
            <ul>
                <li>Chatbot will have context of previous messages while answering the query</li>
            </ul>
        <h3>Contact Us:</h3>
        <p>
          If you encounter any issues or have suggestions, feel free to add in this 
            <a href="https://quip-amazon.com/WxEyAIPi9A5s/Analytics-Buddy"> quip</a>.
        </p>
      </div>
    );
  }
  
  export default StaticContent;
  