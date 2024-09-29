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
            <h4>SCS DW </h4>
            <ul>
                <li>Want to get just SQL or table informations on SCS DW, just ask</li>
                <li>Real-time data retrieval from SCS DW (scsdatalake redshift cluster). Type <b>/data</b> followed by query</li>
                <li>Download data as CSV/Excel</li>
            </ul>
            <h4>SCS RDS</h4>
            <ul>
                <li>Type <b>/rds</b>, chatbot will know query is related to RDS</li>
                <li>It can give all RDS table related informations and SQL </li>
                <li>It has context of mostly common used tables</li>
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
