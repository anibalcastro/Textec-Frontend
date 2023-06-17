import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VerticalNavbar from './components/nav/Nav';
import './App.css';

import Encabezado from './components/header/Header';

import Inicio from './Layouts/Dashboard';
import Clientes from './Layouts/Clientes';
import Medidas from './Layouts/Medidas';
import Login from './Layouts/Login';

function App() {
  return (
    <Router>
      <div>
        <header>
          <Encabezado />
        </header>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-2">
              <VerticalNavbar />
            </div>
            <div className="contenido col-md-10">
              <Routes>
                <Route path="/" element={<Inicio />} />
                <Route path='/login' element={<Login />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/mediciones" element={<Medidas />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
