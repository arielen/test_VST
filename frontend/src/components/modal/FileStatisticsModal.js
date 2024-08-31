import React, { useState } from 'react';

import { Modal, Spinner, Alert, Button, ButtonGroup } from 'react-bootstrap';
import { EyeFill, CloudDownloadFill } from 'react-bootstrap-icons';

import { useSortableData } from '../../hooks/useSortableData';

import TableWord from '../TableWord';
import FileContentModal from './FileContentModal';

function FileStatisticsModal({ show, onHide, file, statistics, loading }) {
  const [viewModalShow, setViewModalShow] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(null);
  const { items: sortedStatistics, requestSort, getSortIcon } = useSortableData(statistics);

  const handleViewFile = async () => {
    if (file) {
      setViewModalShow(true);
      setFileLoading(true);
      setFileError(null);

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/show/${file.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch file content');
        }
        const data = await response.text();
        setFileContent(data);
      } catch (err) {
        setFileError(err.message);
      } finally {
        setFileLoading(false);
      }
    }
  };

  const handleDownloadFile = () => {
    if (file) {
      window.open(`http://127.0.0.1:8000/api/download/${file.id}`, '_blank');
    }
  };

  const handleCloseViewModal = () => {
    setViewModalShow(false);
    setFileContent(null);
    setFileError(null);
  };

  const columns = [
    { key: 'text', label: 'Word' },
    { key: 'count_in_current_file', label: 'Count in Current File' },
    { key: 'total_count', label: 'Count in All Files' },
    { key: 'file_count', label: 'Found In The Files' },
    { key: 'file_percentage', label: 'Found In The Files (%)', format: (value) => `${value.toFixed(2)}%` },
  ];

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{file ? `Statistics for ${file.file_name}` : 'Statistics'}</Modal.Title>
          <ButtonGroup className="ms-auto">
            <Button variant="primary" onClick={handleViewFile}>
              <EyeFill />
            </Button>
            <Button variant="success" onClick={handleDownloadFile}>
              <CloudDownloadFill />
            </Button>
          </ButtonGroup>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : statistics ? (
            <TableWord
              data={sortedStatistics}
              loading={false}
              error={null}
              requestSort={requestSort}
              getSortIcon={getSortIcon}
              columns={columns}
            />
          ) : (
            <Alert variant="info">No statistics available for this file.</Alert>
          )}
        </Modal.Body>
      </Modal>

      <FileContentModal
        show={viewModalShow}
        onHide={handleCloseViewModal}
        fileContent={fileContent}
        fileLoading={fileLoading}
        fileError={fileError}
      />
    </>
  );
}

export default FileStatisticsModal;
