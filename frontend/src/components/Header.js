import React, { useState } from 'react';

import { Nav, Navbar, NavItem, NavLink } from 'react-bootstrap';

function Header({ onTabSelect }) {
  const [activeTab, setActiveTab] = useState('upload');

  const handleSelect = (selectedTab) => {
    setActiveTab(selectedTab);
    if (onTabSelect) {
      onTabSelect(selectedTab);
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Navbar.Brand href="#">File Analyzer</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto" activeKey={activeTab}>
          <NavItem>
            <NavLink
              eventKey="upload"
              onClick={() => handleSelect('upload')}
              className={activeTab === 'upload' ? 'nav-link active' : 'nav-link'}
            >
              Upload File
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              eventKey="words"
              onClick={() => handleSelect('words')}
              className={activeTab === 'words' ? 'nav-link active' : 'nav-link'}
            >
              View Words
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              eventKey="files"
              onClick={() => handleSelect('files')}
              className={activeTab === 'files' ? 'nav-link active' : 'nav-link'}
            >
              View Files
            </NavLink>
          </NavItem>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
