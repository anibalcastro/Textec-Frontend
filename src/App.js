import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import VerticalNavbar from './components/nav/Nav';
import './App.css';

import Encabezado from './components/header/Header';

import Inicio from './Layouts/Dashboard';
import Clientes from './Layouts/Clientes/Clientes';
import RegistroCliente from './Layouts/Clientes/RegistroClientes';
import ModificarCliente from './Layouts/Clientes/ModificarCliente';
import DetalleCliente from './Layouts/Clientes/DetalleCliente';
import Medidas from './Layouts/Medidas';
import Login from './Layouts/Login';
import NuevosModulos from './Layouts/NuevosModulos';
import NoEncotrada from './Layouts/NoEncontrada';

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
                <Route exact path="/" element={<Inicio />} />
                <Route exact path="/inicio" element={<Inicio />} />
                <Route exact path='/login' element={<Login />} />
                <Route exact path="/clientes" element={<Clientes />} />
                <Route exact path="/clientes/registro" element={<RegistroCliente />} />
                <Route exact path="/clientes/editar/:userId" element={<ModificarCliente />} />
                <Route exact path="/clientes/:userId" element={<DetalleCliente />} />
                <Route exact path='/empresas' element={<NuevosModulos />} />
                <Route exact path="/mediciones" element={<Medidas />} />
                <Route exact path='/orden' element={<NuevosModulos />} />
                <Route exact path='/arreglos' element={<NuevosModulos />} />
                <Route exact path='/articulos' element={<NuevosModulos />} />
                <Route exact path='/inventario' element={<NuevosModulos />} />
                <Route exact path='/reportes' element={<NuevosModulos />} />
                <Route exact path="*" element={<NoEncotrada />} />
                
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
