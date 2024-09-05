import React, { useState, useEffect } from 'react';

import { ListGroup, Button, Spinner, Alert, ButtonGroup } from 'react-bootstrap';
import { EyeFill, CloudDownloadFill } from 'react-bootstrap-icons';

import FileStatisticsModal from './modal/FileStatisticsModal';
import FileContentModal from './modal/FileContentModal';

function FileList() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [fileStatistics, setFileStatistics] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/files/');
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        setFiles(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleViewFile = async (file) => {
    setSelectedFile(file);
    setFileLoading(true);
    setFileError(null);
    setShowViewModal(true);

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
  };

  const handleDownloadFile = (file) => {
    window.open(`http://127.0.0.1:8000/api/download/${file.id}`, '_blank');
  };

  const handleFileClick = async (file) => {
    setSelectedFile(file);
    setLoadingStats(true);
    setShowModal(true);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/stats/${file.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch file statistics');
      }
      const data = await response.json();
      setFileStatistics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFileStatistics(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setFileContent(null);
    setFileError(null);
  };

  if (loading) {
    return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div className="my-4">
      <h3>Files</h3>
      {files.length === 0 ? (
        <Alert variant="info">No files available.</Alert>
      ) : (
        <ListGroup>
          {files.map(file => (
            <ListGroup.Item key={file.id} className="d-flex justify-content-between align-items-center">
              <div onClick={() => handleFileClick(file)} style={{ cursor: 'pointer' }}>
                {file.file_name}
              </div>
              <ButtonGroup>
                <Button variant="primary" onClick={() => handleViewFile(file)}>
                  <EyeFill /> View
                </Button>
                <Button variant="success" onClick={() => handleDownloadFile(file)}>
                  <CloudDownloadFill /> Download
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <FileStatisticsModal
        show={showModal}
        onHide={handleCloseModal}
        file={selectedFile}
        statistics={fileStatistics}
        loading={loadingStats}
      />

      <FileContentModal
        show={showViewModal}
        onHide={handleCloseViewModal}
        fileContent={fileContent}
        fileLoading={fileLoading}
        fileError={fileError}
      />
    </div>
  );
}

export default FileList;
