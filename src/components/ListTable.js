// src/components/ListTable.js
import React from 'react';
import './ListTable.css'; // Optional: Create and import CSS for additional styling

const ListTable = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>No data available to display.</div>;
    }

    // Extract table headers from the keys of the first object
    const headers = Object.keys(data[0]);

    return (
        <table className="data-table">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index}>{header.replace(/_/g, ' ').toUpperCase()}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {headers.map((header, cellIndex) => (
                            <td key={cellIndex}>
                                {typeof row[header] === 'boolean' ? (row[header] ? 'Yes' : 'No') : row[header]}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ListTable;
