// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import Compiler from './Compiler'; // Adjust the path if necessary

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Compiler />
    </React.StrictMode>
);
