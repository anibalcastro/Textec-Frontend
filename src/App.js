import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cookies from "js-cookie";
import jwtDecode from 'jwt-decode';
import Sidebar from "./components/Sidebar/Sidebar";

import "./App.css";


import Login from "./Pages/Login";

import Inicio from "./Pages/Dashboard";
import Clientes from "./Pages/Clientes/Clientes";
import RegistroCliente from "./Pages/Clientes/RegistroClientes";
import ModificarCliente from "./Pages/Clientes/ModificarCliente";
import DetalleCliente from "./Pages/Clientes/DetalleCliente";

import Medidas from "./Pages/Mediciones/Medidas";
import DetalleMedicion from "./Pages/Mediciones/DetalleMedicion";
import RegistroMedicion from "./Pages/Mediciones/RegistroMedicion";
import RegistroMedicionCliente from "./Pages/Mediciones/RegistroMedicionCliente";
import ModificarMedicion from "./Pages/Mediciones/ModificarMedicion";
import DetalleClienteMediciones from "./Pages/Mediciones/DetalleClienteMedicion";

import Empresas from "./Pages/Empresas/Empresas";
import RegistroEmpresa from "./Pages/Empresas/RegistroEmpresa";
import EditarEmpresa from "./Pages/Empresas/EditarEmpresa";
import DetalleEmpresa from "./Pages/Empresas/DetalleEmpresa";

import Product  from "./Pages/Productos/Products";
import CreateProduct from "./Pages/Productos/CreateProduct";
import ProductDetail from "./Pages/Productos/ProductDetail";
import EditProduct from "./Pages/Productos/EditProduct";

import Orders from "./Pages/OrdenPedido/Orders";
import CreateOrder from "./Pages/OrdenPedido/CreateOrder";
import OrderDetail from "./Pages/OrdenPedido/OrderDetail";
import EditOrder from "./Pages/OrdenPedido/EditOrder";

import Payments from "./Pages/Pagos/Payments";
import DetailPayment from "./Pages/Pagos/DetailPayments";

import Repairs from "./Pages/Reparaciones/Repair";
import CreateRepair from "./Pages/Reparaciones/CreateRepair.jsx";
import EditRepair from "./Pages/Reparaciones/EditRepair";
import DetailRepair from "./Pages/Reparaciones/DetailRepair.jsx";

import Supplier from "./Pages/Proveedor/Supplier";
import CreateSupplier from "./Pages/Proveedor/CreateSupplier";
import EditSupplier from "./Pages/Proveedor/EditSupplier";
import SupplierDetail from "./Pages/Proveedor/SupplierDetail";
import CreateProductSuplier from "./Pages/Proveedor/Productos/CreateProduct";
import EditProductSuplier from "./Pages/Proveedor/Productos/EditProduct";


import NuevosModulos from "./Pages/NuevosModulos";
import NoEncotrada from "./Pages/NoEncontrada";

import { useEffect, useState } from "react";

function App() {

  const token = Cookies.get("jwtToken"); 
  const [listaClientes, setListaClientes] = useState([]);

  useEffect(() => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  
  const mostrarContenido = validarToken(token);

  return (
    <Router>
       
        {mostrarContenido ? (
          
              <Sidebar >
                <Routes>
                  <Route exact path="/" element={<Inicio />} />
                  <Route exact path="/inicio" element={<Inicio />} />
                  
                  <Route exact path="/clientes" element={<Clientes />} />
                  <Route exact path="/clientes/registro" element={<RegistroCliente />} />
                  <Route exact path="/clientes/editar/:userId" element={<ModificarCliente />} />
                  <Route exact path="/clientes/:userId" element={<DetalleCliente />} />

                  <Route exact path="/empresas" element={<Empresas />} />
                  <Route exact path="/empresas/registro" element={<RegistroEmpresa />} />
                  <Route exact path="/empresa/editar/:idEmpresa" element={<EditarEmpresa />} />
                  <Route exact path="/empresa/:idEmpresa" element={<DetalleEmpresa />} />
                  
                  <Route exact path="/mediciones" element={<Medidas />} />
                  <Route exact path="/mediciones/:idDetalle" element={<DetalleMedicion />}/>
                  <Route exact path="/mediciones/registro" element={<RegistroMedicion clientes={listaClientes} />} />
                  <Route exact path="/mediciones/editar/:medicionId" element={<ModificarMedicion />} />
                  <Route exact path="/mediciones/cliente/:userId" element={<DetalleClienteMediciones />} />
                  <Route exact path="/mediciones/registro/cliente/:userId" element={<RegistroMedicionCliente />} />
                  
                  <Route exact path="/productos" element={<Product />} />
                  <Route exact path="/productos/registro" element={<CreateProduct />} />
                  <Route exact path="/producto/:productId" element={<ProductDetail />} />
                  <Route exact path="/producto/editar/:productId" element={<EditProduct />} />

                  <Route exact path="/orden" element={<Orders />} />
                  <Route exact path="/orden/registro" element={<CreateOrder />} />
                  <Route exact path="/orden/:ordenId" element={<OrderDetail />} />
                  <Route exact path="/orden/editar/:ordenId" element={<EditOrder />} />

                  <Route exact path="/pagos" element={<Payments />} />
                  <Route exact path="/:tipo/:id/pagos" element={<DetailPayment />} />
                  
                  <Route exact path="/reparaciones" element={<Repairs />} />
                  <Route exact path="/reparacion/:repairId" element={<DetailRepair />} />
                  <Route exact path="/reparaciones/registrar" element={<CreateRepair />} />
                  <Route exact path="/reparacion/editar/:repairId" element={<EditRepair />} />

                  <Route exact path="/proveedores" element={<Supplier />} />
                  <Route exact path="/proveedores/registrar" element={<CreateSupplier />} /> 
                  <Route exact path="/proveedores/:supplierId" element={<SupplierDetail />} /> 
                  <Route exact path="/proveedor/editar/:supplierId" element={<EditSupplier />} /> 
                  <Route exact path="/proveedor/productos/registrar/:supplierId" element={<CreateProductSuplier />} /> 
                  <Route exact path="/proveedor/productos/editar" element={<EditProductSuplier />} /> 
                  

                  <Route exact path="/inventario" element={<NuevosModulos />} />
                  <Route exact path="/reportes" element={<NuevosModulos />} />
                  <Route exact path="*" element={<NoEncotrada />} />
                </Routes>
                </Sidebar>
                
        ) : (
          <Login />
        )}
    </Router>
  );
}

export default App;
