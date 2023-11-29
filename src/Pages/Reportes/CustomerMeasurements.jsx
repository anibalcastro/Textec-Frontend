import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import TableReportCustomersMeasurement from "../../components/Tables/TableReportCustomersMeasurement";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function CustomerMeasurements() {
  const [filter, setFilter] = useState("");
  const [companies, setCompanies] = useState([]);
  const [companySelect, setCompanySelect] = useState("");
  const [customers, setCustomers] = useState([]);
  const [getCustomersCalled, setGetCustomersCalled] = useState(false); // Nuevo estado
  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    
    alertInvalidatePermission();
    getCompanies();
  
    if (!getCustomersCalled) {
      
      getCustomers();
      setGetCustomersCalled(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCustomersCalled]);

  const getCustomers = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/vista/mediciones-clientes",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          const datosFiltrados = data.filter((dato) => {
            return dato.empresa.toLowerCase().includes(companySelect.toLowerCase());
          });
          setCustomers(datosFiltrados);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const validateUserPermission = () => {
    if (role !== "Visor") {
      return true;
    }

    return false;
  };

  const alertInvalidatePermission = () => {
    if (!validateUserPermission()) {
      Swal.fire(
        "Acceso denegado",
        "No tienes los permisos necesarios para realizar esta acción.",
        "info"
      ).then((result) => {
        if (result.isConfirmed) {
          navigate("/inicio");
        } else {
          navigate("/inicio");
        }
      });
    }
  };

  const handleFiltroChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSelectChange = (event) => {
    if (event) {
      const nameCompany = event.target.value;
      setCompanySelect(nameCompany);
    }
  };

  const filterCustomers = () => {
    const datosFiltrados = customers.filter((dato) => {
      return dato.empresa.toLowerCase().includes(companySelect.toLowerCase());
    });

    return datosFiltrados;
  };

  const filterCompany = () => {
    const datosFiltrados = companies.filter((dato) => {
      return dato.nombre_empresa.toLowerCase().includes(filter.toLowerCase());
    });

    return datosFiltrados;
  };

  const getCompanies = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/empresas", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("data")) {
          const { data } = result;
          setCompanies(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const downloadPDF = () => {
    if (companySelect !== ''){
      Swal.fire({
        title: "Generando el PDF",
        text: "Espere un momento...",
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });
  
      var myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer  ${token}`);
  
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
  
      fetch(
        `https://api.textechsolutionscr.com/api/v1/mediciones-clientes/${companySelect}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          const download_url = decodeURIComponent(result.download_url);
          const downloadLink = document.createElement("a");
          downloadLink.href = download_url;
          downloadLink.target = "_self"; // Abrir en una nueva pestaña
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          Swal.close();
        })
        .catch((error) => {
          console.error("Error durante la descarga del PDF:", error);
          console.log("Respuesta completa:", error.response); // Asumiendo que tienes una propiedad 'response' en el objeto de error
        });
    }
    else{
      Swal.fire(
        "Error",
        "Debe seleccionar una empresa.",
        "error"
      )
    }
  };

  return (
    <React.Fragment>
      <Header title="Mediciones de clientes por empresa" />

      <div className="container mediciones-filtro">
        <button className="btn-registrar" onClick={() => downloadPDF()}>
          Descargar
        </button>
      </div>

      <div className="container-filtro-ordenes">
        <input
          className="filtro-pedidos"
          type="text"
          value={filter}
          onChange={handleFiltroChange}
          placeholder="Buscar empresa"
        />

        <select
          className="filtro-pedidos"
          onChange={handleSelectChange}
          name="empresa"
          id="empresa"
          required
        >
          <option value="">Selecciona una empresa</option>
          {filterCompany() &&
            filterCompany().map((empresa) => (
              <option key={empresa.id} value={empresa.nombre_empresa}>
                {empresa.nombre_empresa}
              </option>
            ))}
        </select>
      </div>

      <hr className="division" />

      <TableReportCustomersMeasurement datos={filterCustomers()} />
    </React.Fragment>
  );
}
