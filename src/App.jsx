import React from 'react';
import { Routes, Route } from "react-router-dom";

import NotFoundView from './views/NotFoundView';
import ResultsView from './views/ResultsView';
import SearchView from './views/SearchView';
import './scss/index.scss';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SearchView />} />
        <Route path="results" element={<ResultsView />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </div>
  );
}

export default App;
