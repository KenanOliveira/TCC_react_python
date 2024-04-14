import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

function Assistir() {
    const [video, setVideo] = useState({});

    const {id} = useParams();

    useEffect(() => {
        axios.get('http://localhost:5000/buscaUnico/'+id)
        .then(response => {
            setVideo(response.data.result);
        })
        .catch(error => console.error(error));
    }, [id])

    return (
        <div>
            <div className="video">
                <iframe title={video.titulo} src={video.link}></iframe>
            </div>
            <div className="content">
                <h5>{video.titulo}</h5>
                <hr/>
                <span className="descricao">{video.descricao}</span>
            </div>
        </div>
    );
}

export default Assistir;