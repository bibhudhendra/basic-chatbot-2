import React from 'react';

const ListTable = ({ data }) => {

    return (
        <table>
            <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <td key={cellIndex}>
                            {cell.startsWith("'") && cell.endsWith("'")
                                ? cell.slice(1, -1) // Remove the single quotes around the string
                                : cell}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default ListTable;
