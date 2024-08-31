import React, { useState } from 'react';

import Header from './components/Header';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import WordList from './components/WordList';

function App() {
  const [currentTab, setCurrentTab] = useState('upload');

  const renderContent = () => {
    switch (currentTab) {
      case 'upload':
        return <FileUpload />;
      case 'words':
        return <WordList />;
      case 'files':
        return <FileList />;
      default:
        return <FileUpload />;
    }
  };

  return (
    <div className="container">
      <Header onTabSelect={setCurrentTab} />
      {renderContent()}
    </div>
  );
}

export default App;
