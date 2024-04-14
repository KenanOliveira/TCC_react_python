import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Inicio from './partials/Inicio';
import NotFound from './errors/NotFound';

import InserirVideo from './partials/Videos/Inserir';
import AtualizarVideo from './partials/Videos/Atualizar';

import InserirUser from './partials/Users/InserirUser';
import AtualizarUser from './partials/Users/AtualizarUser';
import ListarUser from './partials/Users/ListarUser';

import Login from './auth/Login';

import { AuthProvider } from './auth/AuthProvider';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <div className={localStorage.getItem('token') ? 'exibir' : 'esconder'}>
        <Routes>
          {/* INICIO */}
          <Route path='/' element={<Inicio />} />

          {/* VIDEOS */}
          <Route path='/inserirVideo' element={<InserirVideo />} />
          <Route path='/atualizarVideo/:id' element={<AtualizarVideo />} />

          {/* USUARIOS */}
          <Route path='/cadastro' element={<InserirUser />} />
          <Route path='/atualizarUser/:id' element={<AtualizarUser />} />
          <Route path='/listarUser' element={ <ListarUser/> } />

          {/* LOGIN */}
          <Route path='/login' element={<Login/>}/>

          {/* PAGINA NOT FOUND */}
          <Route path='*' element={ <Navigate to='/404'/>} />
          <Route path='/404' element={<NotFound />} />
        </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;