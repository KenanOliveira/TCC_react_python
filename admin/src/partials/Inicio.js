import React, { useEffect } from 'react'
import axios from 'axios';
import {format} from 'date-fns';

function Inicio() {
    const [videos, setVideos] = React.useState([]);

    useEffect(() => {
        carregarVideos();
    }, []);

    const carregarVideos = () => {
        axios.get('http://localhost:5000/buscaTodos')
        .then(response => {
            const formatedDate = response.data.result.map(video => ({
                ...video,
                data_upload: format(new Date(video.data_upload), 'dd/MMM HH:mm')
            }));
            setVideos(formatedDate);
        })
        .catch(error => console.error("Erro", error));
    }

    function atualizarVideo(e) {
        const id = e.target.value;
        window.location.assign('/atualizarVideo/'+id);
    }

    function deletarVideo(e) {
        const id = e.target.value;

        axios.delete('http://localhost:5000/deletaVideo/'+id)
        .then(response => {
            console.log(response.data.result);
            carregarVideos();
        })     
        .catch(error => console.log("Erro", error))
    }

    return (
        <table className="table">
        {videos &&
            <>
            <thead>
                <tr>
                    <th className='col-sm-1'>THUMB</th>
                    <th className='col-sm-4'>TÍTULO</th>
                    <th className='col-sm-1'>INSERIDO</th>
                    <th className='col-sm-1 text-center'>EDITAR</th>
                    <th className='col-sm-1 text-center'>DELETAR</th>
                </tr>
            </thead>
            <tbody>
                {videos.map(video => (
                    <tr key={video._id}>
                        <td><img className='col-sm-12' src={video.thumb} alt={video.titulo} /></td>
                        <td className='titulo'>{video.titulo}</td>
                        <td className='upload'>{video.data_upload}</td>
                        <td className='icons'><button className='btn btn-link bi bi-pencil-fill' value={video._id} onClick={atualizarVideo}></button></td>
                        <td className='icons'><button className='btn btn-link bi bi-trash-fill text-center' value={video._id} onClick={deletarVideo}></button></td>
                    </tr>
                ))}
            </tbody>
            </>}
        </table>
    );
}

export default Inicio;