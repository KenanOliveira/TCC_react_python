// AuthProvider.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp > currentTime) {
                    setAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                }
            }catch (error) {
                setAuthenticated(false);
                localStorage.removeItem('token');
                navigate('/login');
            }
        } else {
            setAuthenticated(false);
            navigate('/login');
        }
    }, [navigate]);

    const login = (token, user, avatar) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        localStorage.setItem('avatar', avatar);
        setAuthenticated(true);
    };

    const logout = () => {
        // Lógica de logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('avatar');
        setAuthenticated(false);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};