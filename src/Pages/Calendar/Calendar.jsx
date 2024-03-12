import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const WeeklySection = ({ week, dates, activities, weekId }) => {
  const [isHidden, setIsHidden] = useState(true);
  const [cardHeight, setCardHeight] = useState("min-content"); // Inicialmente se establece en 'min-content'
  const [checkedActivities, setCheckedActivities] = useState([]);

  const token = Cookies.get("jwtToken");
  const role = Cookies.get("role");

  useEffect(() => {
    // Inicializa checkedActivities con los IDs de las actividades que ya están completadas (estado === true)
    const initialCheckedActivities = activities
      .filter((activity) => activity.estado)
      .map((activity) => activity.id);
    setCheckedActivities(initialCheckedActivities);
  }, [activities]);

  const toggleHidden = () => {
    setIsHidden(!isHidden);
    setCardHeight(isHidden ? "auto" : "min-content"); // Cambia a 'auto' cuando se expande
  };

  const handleCheckboxChange = (id) => {
    // Aquí puedes ejecutar la acción deseada
    // Verifica si el ID de la actividad está en el array checkedActivities
    const isChecked = checkedActivities.includes(id);

    // Actualiza el estado del checkbox
    if (isChecked) {
      setCheckedActivities(
        checkedActivities.filter((activityId) => activityId !== id)
      );
    } else {
      setCheckedActivities([...checkedActivities, id]);
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://api.textechsolutionscr.com/api/v1/modificar/estado/trabajo/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        const { status } = result;
        if (status === 200) {
          Swal.fire("Notificación", `Se ha completado la tarea`, "success");
        }
      })
      .catch((error) => console.error(error));

    console.log("termina");
  };

  return (
    <React.Fragment>

      <div className="weekly-section-container">
        <div
          className={`weekly-section-card card`}
          style={{ height: cardHeight }}
        >
          <div className="weekly-section-card-header card-header">
            <h2 className="card-title card-title-weekly">{week}</h2>
            <p>{dates}</p>
          </div>

          <div className="weekly-section-card-body">
            <button
              className="weekly-section-button btn btn-primary mb-3"
              onClick={toggleHidden}
            >
              {isHidden ? "Mostrar" : "Ocultar"}
            </button>
            {!isHidden && (
              <table className="table">
                <thead>
                  <tr>
                    <th>Orden</th>
                    <th>Completa</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={index}>
                      <td>
                        {
                          <Link
                            className="link-nombre"
                            to={`/orden/${activity.orden.id}`}
                          >{`${activity.orden.titulo}`}</Link>
                        }
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={checkedActivities.includes(activity.id)}
                          disabled={checkedActivities.includes(activity.id) || role === "Visor"}
                          onChange={() => handleCheckboxChange(activity.id)}
                        />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="2" style={{ textAlign: "center" }}>
                      <button className="weekly-section-button btn btn-success">
                        <Link
                          className="linkAddActivity"
                          to={`/semana/actividades/${weekId}`}
                        >
                          Agregar
                        </Link>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const App = () => {
  const [weekly, setWeekly] = useState([]);
  const [activities, setActivities] = useState([]);
  const [weeklyActivities, setWeeklyActivities] = useState([]);

  const token = Cookies.get("jwtToken");

  useEffect(() => {
    // Obtener actividades y semanas
    fetchWeekly();
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateWeeklyActivities = (weekly, activities) => {
    if (weekly && activities && weekly.length > 0 && activities.length > 0) {
      const updatedWeekly = addActivityToWeekly(weekly, activities);
      setWeeklyActivities(updatedWeekly);
    }
  };

  useEffect(() => {
    // Una vez que las actividades y las semanas estén disponibles, agregar actividades a las semanas
    updateWeeklyActivities(weekly, activities);
  }, [weekly, activities]);

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
        setActivities(data);
        return data;
      })
      .catch((error) => console.error(error));
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
        setWeekly(data);
        return data;
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
      });
  };

  const addActivityToWeekly = (semana, actividad) => {
    const updatedWeekly = semana.map((week) => {
      // Inicializar un objeto nuevo para la semana
      const nuevaSemana = { ...week };

      // Filtrar las actividades correspondientes a esta semana
      const actividadesSemana = actividad.filter(
        (actividad) => actividad.idSemana === week.id
      );

      // Si hay actividades para esta semana, agregarlas al nuevo objeto de semana
      if (actividadesSemana.length > 0) {
        nuevaSemana.actividades = actividadesSemana.map((actividad) => ({
          id: actividad.id,
          estado: actividad.estado,
          orden: {
            ...actividad.orden,
            idActividad: actividad.id,
            estado: actividad.estado,
          },
        }));
      } else {
        // Si no hay actividades para esta semana, establecer el arreglo de actividades como vacío
        nuevaSemana.actividades = [];
      }
      return nuevaSemana;
    });

    return updatedWeekly;
  };


  /**Filtro */
  const [filterType, setFilterType] = useState("activityName");
  const [activityName, setActivityName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterChange = () => {
    let filteredData = [...weeklyActivities];

    // Filtrar por nombre de actividad
    if (filterType === "activityName" && activityName.trim() !== "") {
      filteredData = filteredData.filter((item) =>
        item.actividades.some((actividad) =>
          actividad.orden.titulo
            .toLowerCase()
            .includes(activityName.toLowerCase())
        )
      );
    }

    // Filtrar por rango de fechas
    if (filterType === "dateRange" && startDate && endDate) {
      let filtro = [];

      // Filtrar por rango de fechas
      if (filterType === "dateRange" && startDate && endDate) {

        weeklyActivities.forEach((week) => {
          const itemStartDate = new Date(week.fechaInicio);
          const itemEndDate = new Date(week.fechaFinal);
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);

          console.log("itemStartDate:", itemStartDate);
          console.log("itemEndDate:", itemEndDate);
          console.log("startDateObj:", startDateObj);
          console.log("endDateObj:", endDateObj);
          console.log("Comparison result:", itemStartDate >= startDateObj && itemEndDate <= endDateObj);

          if (itemStartDate >= startDateObj && itemEndDate <= endDateObj) {
            filtro.push({ ...week });
          }
        });


        setWeeklyActivities(filtro);
      }
      return true
    }

    //Swal.fire("Información", `No se han encontrado tareas en, este rango de fechas`, "info");
    //return updateWeeklyActivities(weekly, activities);
    // Llamar a la función de retorno con los datos filtrados
    console.log(filteredData);
    setWeeklyActivities(filteredData);
  };

  const handleFilterDelete = () => {
    setActivityName("");
    setStartDate("");
    setEndDate("");
    updateWeeklyActivities(weekly, activities);
  };

  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleActivityNameChange = (e) => {
    setActivityName(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <React.Fragment>
      <Header title="Semanas" />

      <div className="text-center mt-3">
        <div
          className="btn-group"
          role="group"
          aria-label="Basic radio toggle button group"
        >
          <input
            type="radio"
            className="btn-check"
            name="filterType"
            id="filterTypeActivity"
            value="activityName"
            checked={filterType === "activityName"}
            onChange={handleFilterTypeChange}
          />
          <label
            className={`btn ${filterType === "activityName" ? "btn-dark" : "btn-outline-dark"
              }`}
            htmlFor="filterTypeActivity"
          >
            Nombre de la Actividad
          </label>

          <input
            type="radio"
            className="btn-check"
            name="filterType"
            id="filterTypeDateRange"
            value="dateRange"
            checked={filterType === "dateRange"}
            onChange={handleFilterTypeChange}
          />
          <label
            className={`btn ${filterType === "dateRange" ? "btn-dark" : "btn-outline-dark"
              }`}
            htmlFor="filterTypeDateRange"
          >
            Rango de Fechas
          </label>
        </div>

        {filterType === "activityName" && (
          <input
            type="text"
            className="form-control mt-2"
            value={activityName}
            onChange={handleActivityNameChange}
            placeholder="Nombre de actividad"
          />
        )}

        {filterType === "dateRange" && (
          <div className="mt-2">
            <div className="row">
              <div className="col">
                <label htmlFor="startDate" className="form-label">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </div>
              <div className="col">
                <label htmlFor="endDate" className="form-label">
                  Fecha Final
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </div>
            </div>
          </div>
        )}

        <div className="container botones-contenedor">
          <button
            className="btn btn-dark mt-2"
            onClick={() => handleFilterChange()}
          >
            Buscar
          </button>

          <button
            className="btn btn-danger mt-2"
            onClick={() => handleFilterDelete()}
          >
            Borrar Filtro
          </button>
        </div>
      </div>

      <hr></hr>

      <div className="container-Weeks">
        {weeklyActivities.map((semana) => {
          //console.log(weeklyActivities);
          return (
            <WeeklySection
              key={semana.id}
              week={semana.nSemana}
              dates={`${semana.fechaInicio} - ${semana.fechaFinal}`}
              activities={semana.actividades}
              weekId={semana.id}
            />
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default App;
