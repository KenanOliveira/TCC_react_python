import React, { useState } from "react";

function Navbar() {
    const [search, setSearch] = useState('');

    const handleSubmit = () => {
        let veri = search.replace(/\+/g, '');
        if (veri.trim() !== ''){
            window.location.assign('/pesquisa/'+search.replace(/^\++|\++$/g, ''));
        }
    }

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">TCC</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    </ul>
                    <div className="d-flex">
                        <input className="form-control me-2" required onKeyDown={(e) => {if(e.key === 'Enter' && search.trim() !== '') {handleSubmit()}}} onChange={(e) => setSearch(e.target.value.replace(/ /g, '+'))} placeholder="Busca" />
                        <button className="btn btn-outline-success bi bi-search" onClick={handleSubmit}></button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;