import React, { useState, useEffect } from 'react';

import { Alert } from 'react-bootstrap';

import { useSortableData } from '../hooks/useSortableData';

import TableWord from './TableWord';

function WordList() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { items: sortedWords, requestSort, getSortIcon } = useSortableData(words);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/stats/');
        if (!response.ok) {
          throw new Error('Failed to fetch words');
        }
        const data = await response.json();
        setWords(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const columns = [
    { key: 'text', label: 'Word' },
    { key: 'total_count', label: 'Count In All Files' },
    { key: 'file_count', label: 'Found In The Files' },
    { key: 'file_percentage', label: 'Found In The Files (%)', format: (value) => `${value.toFixed(2)}%` },
  ];

  return (
    <div>
      <h3>Word Statistics</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {words.length === 0 && !loading ? (
        <Alert variant="info">No words available.</Alert>
      ) : (
        <TableWord
          data={sortedWords}
          loading={loading}
          error={error}
          requestSort={requestSort}
          getSortIcon={getSortIcon}
          columns={columns}
        />
      )}
    </div>
  );
}

export default WordList;
