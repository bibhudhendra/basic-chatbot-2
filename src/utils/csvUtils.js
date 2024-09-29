// src/utils/csvUtils.js

import Papa from 'papaparse';

export const downloadCSV = (data) => {
  if (!data || data.length === 0) {
    alert('No data available to download.');
    return;
  }

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
