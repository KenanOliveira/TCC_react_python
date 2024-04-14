import React from "react";
import axios from 'axios';

function InserirVideo() {
    const [info, setInfo] = React.useState({
        titulo: '',
        descricao: '',
        link: '',
        tags: ''
    });

    const getInfo = (event) => {
        const {name, value} = event.target;
        setInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const cadastro = async() => {
        try {
            const response = await axios.post('http://localhost:5000/inserir', info);
            console.log(response.data);
            window.location.assign('/');
        }catch (error) {
            console.error('Erro ao cadastrar', error);
        }
    };

    return (
        <div className="col-md-6 container-fluid register-container">
            <div className="form-group">
                <label>Titulo</label>
                <input type="text" className="form-control" name="titulo" onChange={getInfo} placeholder="Seu titulo aqui" />
            </div>
            <div className="form-group">
                <label>Link</label>
                <input type="text" className="form-control" name="link" onChange={getInfo} placeholder="Ex: https://www.youtube.com/watch?v=o0tCHzlLkwo" />
            </div>
            <div className="form-group">
                <label>Descrição</label>
                <textarea className="form-control" maxLength={250} name="descricao" onChange={getInfo} placeholder="Descrição do video aqui"></textarea>
            </div>
            <div className="form-group">
                <label>Tags</label>
                <input type="text" className="form-control" name="tags" onChange={getInfo} placeholder="Tags do video aqui. Ex: física, português" />
            </div>
            <button type="submit" onClick={cadastro} className="btn btn-primary col-md-12 mt-4">INSERIR</button>
        </div>
    );
}

export default InserirVideo;