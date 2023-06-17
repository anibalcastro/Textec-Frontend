import React from "react";

const card_information = (props) => {
  const { titulo, numero, color } = props;

  return (
    <React.Fragment>
      <div className="card-body" style={{ background: color }}>
        <h5 className="card-title">{titulo}</h5>
        <p className="card-number">{numero}</p>
      </div>
    </React.Fragment>
  );
};

export default card_information;
