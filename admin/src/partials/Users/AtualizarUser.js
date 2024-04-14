import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function AtualizarUser() {
    const [user, setUser] = useState(null);
    const [info, setInfo] = useState({
        nome: '',
        sobrenome: '',
        email: '',
        pwd: '',
        avatar: null
    });
    const [confirmInfo, setConfirmInfo] = useState({
        confirmEmail: '',
        confirmPwd: ''
    });

    const {id} = useParams();

    useEffect(() => {
        axios.get('http://localhost:5000/buscaUser/'+id)
        .then(response => setUser(response.data.result))
        .catch(error => console.error("Error", error));
    }, [id]);

    const getInfo = (e) => {
        const {name, type} = e.target;
        if (type === 'file') {
            const file = e.target.files[0];
            if (file.size / (1024 * 1024) > 5) {
                alert('5 MB');
                e.target.value = null;
                return;
            }
            setInfo(prevInfo => ({
                ...prevInfo,
                avatar: file
            }));
        } else {
            const {value} = e.target;
            setInfo(prevInfo => ({
                ...prevInfo,
                [name]: value
            }));
        }
    };

    const getConfirmInfo = (e) => {
        const {name, value} = e.target;
        setConfirmInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const atualizar = async() => {
        try {
            if (info.pwd !== confirmInfo.confirmPwd) {
                alert("As senhas não coincidem");
                return;
            }else if (info.email !== confirmInfo.confirmEmail) {
                alert("Os emails não coincidem");
                return;
            }

            if (!validarEmail(user.email) || !validarEmail(info.email)) {
                alert('Email invalido ou igual ao anterior');
                return;
            }

            const response = await axios.put('http://localhost:5000/atualizaUser/'+id, {
                nome: info.nome,
                sobrenome: info.sobrenome,
                email: info.email,
                pwd: info.pwd,
                avatar: info.avatar ? await toBase64(info.avatar) : null
            });
            console.log(response.data.result);
            window.location.assign('/listarUser');
        }catch (error) {
            console.error('Erro ao cadastrar', error);
        }
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            if (!file || !(file instanceof File)) {
                reject(new Error("Arquivo invalido"));
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    return (
        <div className="col-md-6 container-fluid mt-2">
            {user && (
                <>
                    <div className="form-group">
                        <label>NOME</label>
                        <input type="text" className="form-control" name="nome" defaultValue={user.nome} onChange={getInfo} placeholder="Ex: JOSE" />
                    </div>
                    <div className="form-group">
                        <label>AVATAR</label>
                        <input type="file" className="form-control" name="avatar" onChange={getInfo} />
                    </div>
                    <div className="form-group mt-2">
                        <label>SOBRENOME</label>
                        <input type="text" className="form-control" name="sobrenome" defaultValue={user.sobrenome} onChange={getInfo} placeholder="Ex: SILVA" />
                    </div>
                    <div className="form-group mt-2">
                        <label>E-MAIL</label>
                        <input type="email" className="form-control" name="email" defaultValue={user.email} onChange={getInfo} placeholder="Ex: josesilva@gmail.com" />
                    </div>
                    <div className="form-group mt-2">
                        <label>CONFIRME SEU E-MAIL</label>
                        <input type="email" className="form-control" name="confirmEmail" defaultValue={user.email} onChange={getConfirmInfo} placeholder="Ex: josesilva@gmail.com" />
                    </div>
                    <div className="form-group mt-2">
                        <label>SENHA</label>
                        <input type="password" className="form-control" name="pwd" onChange={getInfo} placeholder="Sua senha aqui" />
                    </div>
                    <div className="form-group mt-2">
                        <label>CONFIRMAR SENHA</label>
                        <input type="password" className="form-control" name="confirmPwd" onChange={getConfirmInfo} placeholder="Confirme sua senha aqui" />
                    </div>
                    <button type="submit" onClick={atualizar} className="btn btn-primary col-md-12 mt-4">ATUALIZAR</button>
                </>
            )}
        </div>
    );
}

export default AtualizarUser;