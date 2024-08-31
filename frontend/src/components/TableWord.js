import React from 'react';

import { Table, Spinner, Alert } from 'react-bootstrap';

const TableWord = ({ data, loading, error, requestSort, getSortIcon, columns }) => {
  return (
    <div>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="thead-dark">
            <tr>
              {columns.map((column) => (
                <th key={column.key} onClick={() => requestSort(column.key)}>
                  {column.label} {getSortIcon(column.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.text}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.format ? column.format(item[column.key]) : item[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TableWord;
