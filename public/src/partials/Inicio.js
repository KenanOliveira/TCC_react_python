import React, { useEffect, useState } from "react";
import axios from 'axios';

function Inicio() {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/buscaInicio')
        .then(response => setVideos(response.data.result))
        .catch(error => console.error(error));
    }, []);

    return (
        <div className='card'>
            <div className='card-header'>ÚLTIMOS VÍDEOS</div>
            <div className="row">
                {videos.map(video => (
                    <div className='col-md' key={video._id}>
                        <a href={'/assistir/' + video._id}><img className="card-img-top" src={video.thumb} alt='IMAGEM' /></a>
                        <div className="card-body">
                            <a href={'/assistir/' + video._id}><h5 className="card-title">{video.titulo}</h5></a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Inicio;