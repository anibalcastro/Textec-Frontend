import React, { useState } from "react";

const FilterWeeks = ({ data, onFilterChange }) => {
  const [filterType, setFilterType] = useState("activityName");
  const [activityName, setActivityName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleFilterChange = () => {
    let filteredData = [...data];

    // Filtrar por nombre de actividad
    if (filterType === "activityName" && activityName.trim() !== "") {
      filteredData = filteredData.filter((item) =>
        item.orden.titulo.toLowerCase().includes(activityName.toLowerCase())
      );
    }

    // Filtrar por rango de fechas
    if (filterType === "dateRange" && startDate && endDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.semana.fechaInicio);
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);

        return itemDate >= startDateObj && itemDate <= endDateObj;
      });
    }

    // Llamar a la función de retorno con los datos filtrados
    onFilterChange(filteredData);
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
          className={`btn ${
            filterType === "activityName" ? "btn-dark" : "btn-outline-dark"
          }`}
          htmlFor="filterTypeActivity"
        >
          Nombre de Actividad
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
          className={`btn ${
            filterType === "dateRange" ? "btn-dark" : "btn-outline-dark"
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

      <button className="btn btn-dark mt-2" onClick={handleFilterChange}>
        Aplicar Filtro
      </button>
    </div>
  );
};
export default FilterWeeks;
