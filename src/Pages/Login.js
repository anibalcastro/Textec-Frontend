import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import Icono from "../Images/Logos/Icono.webp";

import Swal from 'sweetalert2';


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    var myHeaders = new Headers();
    myHeaders.append(
      "Cookie",
      "XSRF-TOKEN=eyJpdiI6ImFVVjJQVHlnZ0NlalpnWHJLUTQ0Nnc9PSIsInZhbHVlIjoiSVdjZzRFaUc0TFkrbE4yS2d6SXRVWDU5WjBUckR6NWsxQVFKNXp1cWlUSm0raGlWdTREMDhkNEV6dDFOZVBqcldCajVPNVMwUWJINll5c0JZNjlZSk40M3hPTjVibU1lc2pSWno4QmpNUkdpMVh1bmhNS01QTFlMek5MVjJpOEYiLCJtYWMiOiI4ZWJhZmJkMTY2NGY4OThhNTc2MmQzZDhhOWJhMDZhMjIwMjAxZjQ2OTdiMjc2OThmMjI5OTRkNDExZWRiMjc3IiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IjdBMTVkalN3dFJ2dVBRRkpZWEwwZ1E9PSIsInZhbHVlIjoiWU5lcWhUd2tacVArZXpwblI1a3ZXWVBpcmxBVDIvNTdseW8vV3ZFOWlMVXBEM1B0cDU3d3VNQjc4RmVsS2FpTm1MUmVPUSt4cDNld2NTVVFGT3FMdTBkQTBzSVFoVWFUTnBmb1pNT2ZwWXZvZmRUUzRQUDFKQ3djYTBXZXMvYkEiLCJtYWMiOiIzYzk1ZTE5OGU3YjE2NDc2NzY5OTFiMGUxOTBmYzI2MzNiNjY2ZjhmODI0OGNmYmQ0ZTRhNmZlMjlkYWJkZDI1IiwidGFnIjoiIn0%3D"
    );

    var formdata = new FormData();
    formdata.append("email", username);
    formdata.append("password", password);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://api.textechsolutionscr.com/api/v1/login", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        // console.log(result);

        const { token, status, role } = result; // Desestructurar las propiedades del resultado

        // eslint-disable-next-line eqeqeq
        if (status == 200) {
          Cookies.set("jwtToken", token, { expires: 7 });
          Cookies.set("role", role, { expires: 7 });


          Swal.fire(
            'Bienvenido!',
            'Nos alegra tenerte aquí. Con nuestra plataforma, puedes gestionar todas las operaciones de la empresa textil de manera rápida y eficiente.',
            'success'
          ).then(result => {
            if (result.isConfirmed) {
              navigate('/');
              window.location.reload();
            }
            else {
              navigate('/');
              window.location.reload();
            }
          })
        } else {
          Swal.fire(
            'Error!',
            'Correo electrónico o contraseña incorrecta!',
            'error'
          )
        }
      })
      .catch((error) => console.log("error", error));

    setUsername("");
    setPassword("");
  };

  return (
    <React.Fragment>
      <div className="container login">
        <img src={Icono} className="icono-textech" alt="icono textech" />
        <form className="form-login" onSubmit={handleSubmit}>
          <div className="label-input">
            <label className="lb_login" htmlFor="username">Correo electronico:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              autoComplete="username"
              required
            />
          </div>
          <div className="label-input">
            <label className="lb_login" htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              autoComplete="current-password"
              required
            />
          </div>
          <button className="btn-ingresar" type="submit">
            Ingresar
          </button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Login;
