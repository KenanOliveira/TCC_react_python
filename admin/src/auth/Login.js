import React, { useState } from "react";
import axios from 'axios';
import { useAuth } from "./AuthProvider";
import Message from "../components/Message";

function Login() {
    const {login} = useAuth();
    const [credentials, setCredentials] = useState({
        email: '',
        pwd: ''
    });

    const [message, setMessage] = useState(null);

    const [errors, setErrors] = useState({
        email: '',
        pwd: ''
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials(prevCredentials => ({
            ...prevCredentials,
            [name]: value
        }));
    };

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleLogin = async () => {
        const newErrors = {};

        if (!credentials.email.trim()) {
            newErrors.email = 'Insira seu e-mail';
        } else if (!validarEmail(credentials.email)) {
            newErrors.email = 'E-mail inválido';
        }

        if (!credentials.pwd.trim()) {
            newErrors.pwd = 'Insira sua senha';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/login', credentials);
            const info = response.data.result;
            login(info.token, info.user, info.avatar);
            // Redirecionar para a página de dashboard ou outra página após o login bem-sucedido
            window.location.assign('/');
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            setMessage({type: 'error', content: 'Erro ao fazer login'});
        }
    };

    const handleCloseMessage = () => {
        setMessage(null); // Limpa a mensagem
    };

    return (
        <div className="col-md-3 container-fluid mt-5">
            {message && <Message type={message.type} message={message.content} onClose={handleCloseMessage}/>}
            <div className="form-group">
                <label>E-MAIL</label>
                <input type="email" className={`form-control ${errors.email && 'is-invalid'}`} name="email" value={credentials.email} onChange={handleChange} />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="form-group mt-2">
                <label>SENHA</label>
                <input type="password" className={`form-control ${errors.pwd && 'is-invalid'}`} name="pwd" value={credentials.pwd} onChange={handleChange} />
                {errors.pwd && <div className="invalid-feedback">{errors.pwd}</div>}
            </div>
            <button type="submit" onClick={handleLogin} className="btn btn-primary col-md-12 mt-4">LOGIN</button>
        </div>
    );
}

export default Login;