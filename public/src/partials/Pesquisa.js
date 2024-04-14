import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Pesquisa() {
    const [busca, setBusca] = useState([]);
    const [qtd, setQtd] = useState(0);

    const {pesquisa} = useParams();

    useEffect(() => {
        axios.get('http://localhost:5000/buscar/'+pesquisa)
        .then(response => {
            setBusca(response.data.result);
            setQtd(response.data.qtd);
        })
        .catch(error => console.error(error));
    }, [pesquisa])

    return (
        <table className="table">
            <tbody>
                <div className="alert alert-success">
                    {qtd > 0 ? (
                        <p>Foram encontrados {qtd} vídeos.</p>
                    ) : (
                        <p>Nenhum vídeo encontrado.</p>
                    )}
                </div>
                {busca.map(video => (
                    <tr className="itens-pesquisa">
                        <td className="col-sm-3"><a href={'/assistir/' + video._id}><img className="col-md-12" src={video.thumb} alt={video.titulo} /></a></td>
                        <td className="titulo-search">
                            <div>
                                <a href={'/assistir/' + video._id}><h5>{video.titulo}</h5></a>
                                <small>{video.descricao}</small>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default Pesquisa;