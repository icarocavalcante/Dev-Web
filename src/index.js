import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home'
import Layout from './layout';
import { Cliente, NovoCliente, ClienteLogado, NovoTicket, ClienteTickets } from './pages/cliente';
import { Suporte, SuporteLogado, SuporteTickets } from './pages/suporte';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='home' element={<Home />} />
          <Route path='cliente'>
            <Route path='' element={<Cliente />} />
            <Route path='new' element={<NovoCliente />} />
            <Route path='autenticado' >
              <Route path='' element={<ClienteLogado />} />
              <Route path='new' element={<NovoTicket />} />
              <Route path=':key' element={<ClienteTickets />} />
            </Route>
          </Route>
          <Route path='suporte'>
            <Route path='' element={<Suporte />} />
            <Route path='logado' >
              <Route path='' element={<SuporteLogado />} />
              <Route path=':key' element={<SuporteTickets />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

