import React, { useState } from 'react';

import { useSortableData } from '../hooks/useSortableData';

import TableWord from './TableWord';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const { items: sortedStatistics, requestSort, getSortIcon } = useSortableData(statistics);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:8000/api/upload/', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    })
      .then(response => {
        if (response.status !== 201) {
          throw new Error('File upload failed');
        }
        return response.json();
      })
      .then(data => {
        const fileId = data.id;
        return fetch(`http://localhost:8000/api/stats/${fileId}`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch file statistics');
        }
        return response.json();
      })
      .then(data => {
        setStatistics(data);
      })
      .catch(error => {
        console.error('There was a problem:', error);
      });
  };

  const columns = [
    { key: 'text', label: 'Word' },
    { key: 'count_in_current_file', label: 'Count in Current File' },
    { key: 'total_count', label: 'Count in All Files' },
    { key: 'file_count', label: 'Found In The Files' },
    { key: 'file_percentage', label: 'Found In The Files (%)', format: (value) => `${value.toFixed(2)}%` },
  ];

  return (
    <div className="container my-4">
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>
      <button
        className="btn btn-primary mb-4"
        onClick={handleUpload}
      >
        Upload
      </button>

      {statistics && (
        <TableWord
          data={sortedStatistics}
          loading={false}
          error={null}
          requestSort={requestSort}
          getSortIcon={getSortIcon}
          columns={columns}
        />
      )}
    </div>
  );
}

export default FileUpload;
