import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home'
import Layout from './layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<Navigate to='/home'/>} />
          <Route path='home' element={<Home />}/>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

