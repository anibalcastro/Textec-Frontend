import React, { useState } from 'react';
import Icono from '../Images/Logos/Icono.jpg'


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes realizar la lógica de autenticación con los datos del formulario
        // por ejemplo, enviar una solicitud al servidor para verificar las credenciales

        // Restablecer los campos del formulario después de enviar
        setUsername('');
        setPassword('');
    };

    return (

        <React.Fragment>
            <div className='container login'>
                <img src={Icono} className='icono-textech'  alt='icono textech'/>
                <form className='form-login' onSubmit={handleSubmit}>
                    <div className='label-input'>
                        <label htmlFor="username">Correo electronico:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={handleUsernameChange}
                            autoComplete="username"
                        />
                    </div>
                    <div className='label-input'>
                        <label htmlFor="password">Contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <button className='btn-ingresar' type="submit">Ingresar</button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default Login;
