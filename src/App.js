import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import jwtDecode from 'jwt-decode';
import MenuAdmin from "./components/nav-admin/nav-admin";
import MenuColaborador from "./components/nav-colaborador/nav-colaborador";
import "./App.css";



import Encabezado from "./components/header/Header";

import Inicio from "./Layouts/Dashboard";
import Clientes from "./Layouts/Clientes/Clientes";
import RegistroCliente from "./Layouts/Clientes/RegistroClientes";
import ModificarCliente from "./Layouts/Clientes/ModificarCliente";
import DetalleCliente from "./Layouts/Clientes/DetalleCliente";
import Medidas from "./Layouts/Mediciones/Medidas";
import DetalleMedicion from "./Layouts/Mediciones/DetalleMedicion";
import RegistroMedicion from "./Layouts/Mediciones/RegistroMedicion";
import RegistroMedicionCliente from "./Layouts/Mediciones/RegistroMedicionCliente";
import ModificarMedicion from "./Layouts/Mediciones/ModificarMedicion";
import DetalleClienteMediciones from "./Layouts/Mediciones/DetalleClienteMedicion";
import Login from "./Layouts/Login";
import NuevosModulos from "./Layouts/NuevosModulos";
import NoEncotrada from "./Layouts/NoEncontrada";
import Empresas from "./Layouts/Empresas/Empresas";
import RegistroEmpresa from "./Layouts/Empresas/RegistroEmpresa";
import EditarEmpresa from "./Layouts/Empresas/EditarEmpresa";
import DetalleEmpresa from "./Layouts/Empresas/DetalleEmpresa";


import { useEffect, useState } from "react";

function App() {

  const token = Cookies.get("jwtToken"); 
  const role = Cookies.get("role");
  const [listaClientes, setListaClientes] = useState([]);

  useEffect(() => {
    //console.log(token)
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  
    const solicitudClientesApi = async () => {
      try {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
  
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };
  
        const response = await fetch("https://api.textechsolutionscr.com/api/v1/clientes", requestOptions);
        const result = await response.json();
  
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setListaClientes(data);
          localStorage.setItem('data', JSON.stringify(data));
        } else {
          //console.log("La respuesta de la API no contiene la propiedad 'data'");
          // Mostrar mensaje de error o realizar otra acción
        }
      } catch (error) {
        console.log('error', error);
      }
    };
  
    const fetchData = async () => {
      await delay(1000);
      await solicitudClientesApi();
    };
  
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps

   const intervaloValidacion = setInterval(validarToken(token), 6000); // Validar el token cada 1 minuto (60000 milisegundos)

    return () => {
      clearInterval(intervaloValidacion); // Limpiar el intervalo cuando el componente se desmonte
    };
  }, [token]);

  const validarToken = (token) => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        //console.log('Decode ',decodedToken);
        const currentTime = Date.now() / 1000; // Tiempo actual en segundos
  
        // Verifica si el token ha expirado
        if (decodedToken.exp < currentTime) {
          // El token ha expirado, requerir autenticación
          console.log('Token expiró')
          return false;
        }
  
        // Verifica si el token contiene los datos necesarios para la autenticación
        // Por ejemplo, puedes verificar si contiene un identificador de usuario
  
        // Si el token pasa todas las validaciones, devuelve true
        return true;
      } catch (error) {
        // Error al decodificar el token
        console.log(`error ${error}`)
        return false;
      }
    }
  
    // Si no hay token, requerir autenticación
    return false;
  };

  
  const validarRole = (role) => {
    let Admin = false;

    if (role === "Admin"){
      Admin = true;
    }

    return Admin
  }
  
  const mostrarContenido = validarToken(token);
  const menu = validarRole(role);

  return (
    <Router>
      <div>
        <header>
          <Encabezado />
        </header>

        {mostrarContenido ? (
          <div className="container-fluid">
            <div className="row">
              <div id="menuVertical" className="col-md-2">
                {menu ? (<MenuAdmin />) : (<MenuColaborador />)}
              </div>
              <div className="contenido col-md-10">
                <Routes>
                  <Route exact path="/" element={<Inicio />} />
                  <Route exact path="/inicio" element={<Inicio />} />
                  <Route exact path="/clientes" element={<Clientes />} />
                  <Route
                    exact
                    path="/clientes/registro"
                    element={<RegistroCliente />}
                  />
                  <Route
                    exact
                    path="/clientes/editar/:userId"
                    element={<ModificarCliente />}
                  />
                  <Route
                    exact
                    path="/clientes/:userId"
                    element={<DetalleCliente />}
                  />

                  <Route exact path="/empresas" element={<Empresas />} />
                  <Route exact path="/empresas/registro" element={<RegistroEmpresa />} />
                  <Route exact path="/empresas/modificar/:idEmpresa" element={<EditarEmpresa />} />
                  <Route exact path="/empresas/:idEmpresa" element={<DetalleEmpresa />} />
                  
                  <Route exact path="/mediciones" element={<Medidas />} />
                  <Route exact path="/mediciones/:idDetalle" element={<DetalleMedicion />}/>
                  <Route exact path="/mediciones/registro" element={<RegistroMedicion clientes={listaClientes} />} />
                  <Route
                    exact
                    path="/mediciones/editar/:medicionId"
                    element={<ModificarMedicion />}
                  />
                  
                  <Route exact path="/mediciones/cliente/:userId" element={<DetalleClienteMediciones />} />
                  <Route exact path="/mediciones/registro/cliente/:userId" element={<RegistroMedicionCliente />} />

                  <Route exact path="/orden" element={<NuevosModulos />} />
                  <Route exact path="/arreglos" element={<NuevosModulos />} />
                  <Route exact path="/articulos" element={<NuevosModulos />} />
                  <Route exact path="/inventario" element={<NuevosModulos />} />
                  <Route exact path="/reportes" element={<NuevosModulos />} />
                  <Route exact path="*" element={<NoEncotrada />} />
                </Routes>
              </div>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </div>
    </Router>
  );
}

export default App;
