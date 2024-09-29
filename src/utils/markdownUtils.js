// src/utils/markdownUtils.js

export const generateMarkdownTable = (dataArray) => {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return 'No data available to display.';
    }
  
    const headers = Object.keys(dataArray[0]);
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const dataRows = dataArray.map((row) => {
      return `| ${headers.map((header) => String(row[header] || '')).join(' | ')} |`;
    });
  
    return `${headerRow}\n${separatorRow}\n${dataRows.join('\n')}`;
  };
  