import React from 'react';

import { Modal, Spinner, Alert } from 'react-bootstrap';

function FileContentModal({ show, onHide, fileContent, fileLoading, fileError }) {
  return (
    <Modal show={show} onHide={onHide} size="xl" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>File Content</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {fileLoading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : fileError ? (
          <Alert variant="danger">{fileError}</Alert>
        ) : (
          <pre>{fileContent}</pre>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default FileContentModal;
