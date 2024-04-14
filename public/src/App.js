import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Inicio from './partials/Inicio';
import NotFound from './errors/NotFound';
import Assistir from "./partials/Assistir";
import Pesquisa from "./partials/Pesquisa";

function App() {
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Inicio/>} />

      <Route path="/assistir/:id" element={<Assistir/>} />
      <Route path="/pesquisa/:pesquisa" element={<Pesquisa/>} />

      <Route path="*" element={ <Navigate to='/404' />} />
      <Route path="/404" element={<NotFound />} />
    </Routes>
    </BrowserRouter>
  );
}

export default App;