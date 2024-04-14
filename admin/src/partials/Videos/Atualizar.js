import React, { useEffect } from "react";
import axios from 'axios';
import {useParams} from 'react-router-dom';

function AtualizarVideo() {
    const [video, setVideo] = React.useState(null);
    const [info, setInfo] = React.useState({
        titulo: '',
        descricao: '',
        tags: ''
    });

    const {id} = useParams();

    useEffect(() => {
        axios.get('http://localhost:5000/buscaUnico/'+id)
        .then(response => setVideo(response.data.result))
        .catch(error => console.log("Erro", error));
    }, [id]);
    
    const getInfo = (event) => {
        const {name, value} = event.target;
        setInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };
    
    const atualizar = async() => {
        try {
            const response = await axios.put('http://localhost:5000/atualizaVideo/'+id, info);
            console.log(response.data);
            window.location.assign('/');
        }catch (error) {
            console.error('Erro ao atualizar', error);
        }
    };

    return (
        <div className="col-md-6 container-fluid register-container">
            {video && (
                <>
                    <div className="form-group">
                        <label>Titulo</label>
                        <input type="text" className="form-control" name="titulo" defaultValue={video.titulo} onChange={getInfo} placeholder="Seu titulo aqui" />
                    </div>
                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea className="form-control" maxLength={250} name="descricao" defaultValue={video.descricao} onChange={getInfo} placeholder="Descrição do video aqui"></textarea>
                    </div>
                    <div className="form-group">
                        <label>Tags</label>
                        <input type="text" className="form-control" name="tags" defaultValue={video.tags} onChange={getInfo} placeholder="Tags do video aqui. Ex: física, português" />
                    </div>
                    <button onClick={atualizar} className="btn btn-primary col-md-12 mt-4">ATUALIZAR</button>
                </>
            )}
        </div>
    );
}

export default AtualizarVideo;