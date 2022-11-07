import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home'
import Layout from './layout';
import {Cliente, NovoCliente} from './pages/login/cliente';
import Suporte from './pages/login/suporte';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<Navigate to='/home'/>} />
          <Route path='home' element={<Home />}/>
          <Route path='login'>
            <Route path='cliente'>
              <Route path='' element={<Cliente />}/>
              <Route path='new' element={<NovoCliente />}/>
            </Route>
            <Route path='suporte' element={<Suporte />}/>
          </Route>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

