import axios from "axios";
import React, { useEffect, useState } from "react";

function ListarUser() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        carregarUsers();
    }, []);

    const carregarUsers = () => {
        axios.get('http://localhost:5000/buscaUsers')
        .then(response => setUsers(response.data.result))
        .catch(error => console.error("Erro", error));
    };

    const atualizarUser = (e) => {
        const id = e.target.value;
        window.location.assign('/atualizarUser/'+id);
    };

    const deletarUser = (e) => {
        if (users.length > 1) {
            const id = e.target.value;
    
            axios.delete('http://localhost:5000/deletaUser/'+id)
            .then(response => {
                carregarUsers();
            })
            .catch(error => console.error("Error", error));
        } else {
            alert("Para deletar um usuários, deve haver 2 ou mais, caso contrário, perderá acesso ao sistema!");
        }
    };
    return (
        <table className="table">
            <thead>
                <tr>
                    <th className='col-sm-1'>AVATAR</th>
                    <th className='col-sm-5'>NOME</th>
                    <th className='col-sm-4'>SOBRENOME</th>
                    <th className='col-sm-1 text-center'>EDITAR</th>
                    <th className='col-sm-1 text-center'>DELETAR</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td><img className='col-sm-12 avatar' src={user.avatar} alt={user.nome} /></td>
                        <td>{user.nome}</td>
                        <td>{user.sobrenome}</td>
                        <td className='text-center'><button className='btn btn-link bi bi-pencil-fill' value={user._id} onClick={atualizarUser}></button></td>
                        <td className='text-center'><button className='btn btn-link bi bi-trash-fill text-center' value={user._id} onClick={deletarUser}></button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default ListarUser;