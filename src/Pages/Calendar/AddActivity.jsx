import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const AddActivity = () => {
  const [activitieDB, setActivitiesDB] = useState([]);
  const [order, setOrder] = useState([]);
  const [company, setCompany] = useState([]);
  const [nSemana, setNSemana] = useState("");
  const [activitiesSaved, setActivitiesSaved] = useState([]);

  const { idWeek } = useParams();

  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");
  const navigate = useNavigate();

  useEffect(() => {
    alertInvalidatePermission();
    fetchOrders();
    fetchCompany();
    fetchWeekly();
    fetchActivities();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchCompany();
    fetchWeekly();
    fetchActivities();

    console.log(activitiesSaved);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const fetchWeekly = () => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/semana", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const { data } = result;
        const resultNSemana = getNSemana(data);
        setNSemana(resultNSemana);
      })
      .catch((error) => console.error(error));
  };

  const fetchActivities = () => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      "https://api.textechsolutionscr.com/api/v1/semanas/ordenes",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { data } = result;
        getActivitiesSaved(data);
      })
      .catch((error) => console.error(error));
  };

  const getActivitiesSaved = (actividades) => {
    const semana = actividades.filter(item => item.semana.id === parseInt(idWeek));

    const idOrdenSemana = semana.map(item => item.idOrden);
    setActivitiesSaved(idOrdenSemana);
    setActivitiesDB(idOrdenSemana);
  };

  const getNSemana = (semana) => {
    const resultadosFiltrados = semana.filter(
      (item) => item.id === parseInt(idWeek)
    );
    const nSemana = resultadosFiltrados[0].nSemana;
    return nSemana;
  };

  const fetchCompany = () => {
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
          setCompany(data);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const fetchOrders = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/ordenes", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.hasOwnProperty("ordenes")) {
          const { ordenes } = result;
          const filteredOrders = filterOrders(ordenes);
          setOrder(filteredOrders);
        }
      })
      .catch((error) => console.log("error", error));
  };

  const filterOrders = (orders) => {
    // Filtrar las actividades basadas en su estado
    const filteredActivities = orders.filter(
      (item) =>
        item.estado !== "Anulada" && item.estado !== "Entregada al cliente"
    );
    return filteredActivities;
  };

  const nameCompany = (companyId) => {
    const empresaEncontrada = company.find(
      // eslint-disable-next-line eqeqeq
      (item) => parseInt(item.id) == parseInt(companyId)
    );

    if (empresaEncontrada) {
      return empresaEncontrada.nombre_empresa;
    } else {
      return "Empresa no encontrada";
    }
  };

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const handleCheckboxChange = (id) => {
    // Verificar si el id ya está en el estado activitiesSaved
    const index = activitiesSaved.indexOf(id);
    if (index === -1) {
      // Si no está, agregarlo al estado
      setActivitiesSaved((prevActivitiesSaved) => [...prevActivitiesSaved, id]);
    } else {
      // Si está, quitarlo del estado
      setActivitiesSaved((prevActivitiesSaved) =>
        prevActivitiesSaved.filter((activityId) => activityId !== id)
      );
    }
  };

  const filterActivitiesSaved = (activitiesSaved, activitieDB) => {
    return activitiesSaved.filter((id) => !activitieDB.includes(id));
  };

  const saveActivities = () => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    // Llama a la función filterActivitiesSaved para filtrar las actividades guardadas
    const filteredActivitiesSaved = filterActivitiesSaved(
      activitiesSaved,
      activitieDB
    );   

    const raw = JSON.stringify({
      ordenes: filteredActivitiesSaved,
      semana: parseInt(idWeek),
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    console.log(activitieDB);
    console.log(raw);
    
    fetch(
      "https://api.textechsolutionscr.com/api/v1/asignar/ordenes/semanas",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status, error } = result;

        if (parseInt(status) === 200) {
          
    Swal.fire(
      "Actividades registradas con éxito",
      `Se ha registrado la actividad en la semana ${nSemana}`,
      "success"
    ).then((result) => {
            if (result.isConfirmed) {
              navigate("/calendario");
            } else {
              navigate("/calendario");
            }
          });
        } else {
          let errorMessage = "";

          for (const message of error) {
            errorMessage += message + "\n";
          }

          Swal.fire("Error al crear la orden!", `${errorMessage}`, "error");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <React.Fragment>
      <Header title={`Agregar Actividades - ${nSemana}`} />

      <div className="container containerOrders">
        <table className="tabla-medidas">
          <thead>
            <tr>
              <th></th>
              <th>Titulo</th>
              <th>Empresa</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {order.map((dato, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={activitiesSaved.includes(dato.id)}
                    disabled={activitiesSaved.includes(dato.id)}
                    onChange={() => handleCheckboxChange(dato.id)}
                  />
                </td>
                <td>{dato.titulo}</td>
                <td>{nameCompany(dato.id_empresa)}</td>
                <td>{dato.estado}</td>
                <td>{formatDate(dato.fecha_orden)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary mb-3" onClick={() => saveActivities()}>
        Guardar
      </button>
    </React.Fragment>
  );
};

export default AddActivity;
