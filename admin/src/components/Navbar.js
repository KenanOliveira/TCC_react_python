import React, { useState } from "react";
import { useAuth } from '../auth/AuthProvider'; // Importe o hook useAuth para acessar as funções de autenticação

function Navbar() {
    const { authenticated, logout } = useAuth(); // Use o hook useAuth para acessar a função de logout
    const [showNavbar, setShowNavbar] = useState(false);

    const toggleNavbar = () => {
        setShowNavbar(!showNavbar);
    };

    const handleLogout = () => {
        logout(); // Chame a função de logout quando o botão de logout for clicado
    };

    if (!authenticated) {
        return null;
    }

    return (
        <>
            <header className="header" id="header">
                <div className={`header_toggle ${showNavbar ? 'mostra': ''}`} onClick={toggleNavbar}>
                    <i className={`${showNavbar ? 'bi bi-x-lg' : 'bi bi-list'}`} id="header-toggle"></i>
                </div>
                <div className="header_user">
                    <label>{localStorage.getItem('user')}</label>
                </div>
                <div className="header_img">
                    <img src={localStorage.getItem('avatar')} alt="imagem"/>
                </div>
            </header>
            <div className={`l-navbar ${showNavbar ? 'show' : ''}`} id="nav-bar">
                <nav className="nav">
                    <div>
                        <a href="/" className="nav_logo" onClick={(e) => e.preventDefault()}>
                            <i className='bi bi-bootstrap-fill'></i>
                            <span className="nav_logo-name">TCC</span>
                        </a>
                        <div className="nav_list">
                            <a href="/" className="nav_link">
                                <i className='bi bi-grid nav_icon'></i>
                                <span className="nav_name">Inicio</span>
                            </a>
                            <div className="nav_dropdown">
                                <a href="/" className="nav_link" onClick={(e) => e.preventDefault()}>
                                    <i className='bi bi-person nav_icon'></i>
                                    <span className="nav_name">Users</span>
                                </a>
                                <ul className="nav_dropdown-menu">
                                    <li><a className="nav_dropdown-item bi bi-plus" href="/cadastro">Inserir</a></li>
                                    <li><a className="nav_dropdown-item bi bi-list" href="/listarUser">Listar</a></li>
                                </ul>
                            </div>
                            <div className="nav_dropdown">
                                <a href="/" className="nav_link" onClick={(e) => e.preventDefault()}>
                                    <i className='bi bi-play-btn nav_icon'></i>
                                    <span className="nav_name">Videos</span>
                                </a>
                                <ul className="nav_dropdown-menu">
                                    <li><a className="nav_dropdown-item bi bi-plus" href="/inserirVideo">Inserir</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <a href="/" className="nav_link" onClick={handleLogout}>
                        <i className='bi bi-power nav_icon'></i>
                        <span className="nav_name">Sair</span>
                    </a>
                </nav>
            </div>
        </>
    );
}

export default Navbar;