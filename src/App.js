import logo from './logo.svg';
import './App.css';import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// src/App.js
import React from 'react';
import './App.css';

import Compiler from './Compiler';
import Codingq from './Codingq';
import Cweeks from './Cweeks';



function App() {
  return (
    <Router>
      <div>
        

        <Routes>
        <Route path="/" element={<Compiler />} />
        <Route path="/questions" element={<Codingq/>} />

        <Route path="/Cweeks" element={<Cweeks/>} />
        <Route path="/compiler/:week" element={<Compiler />} />
       
        


       



        </Routes>
      </div>
    </Router>
  );
}

export default App;



