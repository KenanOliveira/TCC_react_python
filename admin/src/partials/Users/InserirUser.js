import React from "react";
import axios from 'axios';

const MAX_FILE_SIZE_MB = 5;

function InserirUser() {
    const [info, setInfo] = React.useState({
        nome: '',
        sobrenome: '',
        email: '',
        pwd: '',
        avatar: null
    });

    const [confirmInfo, setConfirmInfo] = React.useState({
        confirmEmail: '',
        confirmPwd: ''
    });

    const getInfo = (event) => {
        const {name, type} = event.target;
        if (type === 'file') {
            const file = event.target.files[0];
            if (file.size / (1024 * 1024) > MAX_FILE_SIZE_MB) {
                alert('5 MB');
                event.target.value = null;
                return;
            }
            setInfo(prevInfo => ({
                ...prevInfo,
                avatar: file
            }));
        } else {
            const {value} = event.target;
            setInfo(prevInfo => ({
                ...prevInfo,
                [name]: value
            }));
        }
    };

    const getConfirmInfo = (event) => {
        const {name, value} = event.target;
        setConfirmInfo(prevConfirmInfo => ({
            ...prevConfirmInfo,
            [name]: value
        }));
    };

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const cadastro = async() => {
        try {
            if (!info.nome || !info.sobrenome) {
                alert('Insira seu nome');
                return;
            }

            if (!info.avatar) {
                alert("Insira um arquivo");
                return;
            }

            if (info.pwd !== confirmInfo.confirmPwd) {
                alert("As senhas não coincidem");
                return;
            }else if (info.email !== confirmInfo.confirmEmail) {
                alert("Os emails não coincidem");
                return;
            }

            if (!validarEmail(info.email)) {
                alert('Email invalido');
                return;
            }

            const response = await axios.post('http://localhost:5000/cadastro', {
                nome: info.nome,
                sobrenome: info.sobrenome,
                email: info.email,
                pwd: info.pwd,
                avatar: info.avatar ? await toBase64(info.avatar) : null
            });
            console.log(response.data.result);
            window.location.assign('/');
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
            <div className="form-group">
                <label>NOME</label>
                <input type="text" className="form-control" name="nome" onChange={getInfo} placeholder="Ex: JOSE" />
            </div>
            <div className="form-group">
                <label>AVATAR</label>
                <input type="file" className="form-control" name="avatar" onChange={getInfo} />
            </div>
            <div className="form-group mt-2">
                <label>SOBRENOME</label>
                <input type="text" className="form-control" name="sobrenome" onChange={getInfo} placeholder="Ex: SILVA" />
            </div>
            <div className="form-group mt-2">
                <label>E-MAIL</label>
                <input type="email" className="form-control" name="email" onChange={getInfo} placeholder="Ex: josesilva@gmail.com" />
            </div>
            <div className="form-group mt-2">
                <label>CONFIRME SEU E-MAIL</label>
                <input type="email" className="form-control" name="confirmEmail" onChange={getConfirmInfo} placeholder="Ex: josesilva@gmail.com" />
            </div>
            <div className="form-group mt-2">
                <label>SENHA</label>
                <input type="password" className="form-control" name="pwd" onChange={getInfo} placeholder="Sua senha aqui" />
            </div>
            <div className="form-group mt-2">
                <label>CONFIRMAR SENHA</label>
                <input type="password" className="form-control" name="confirmPwd" onChange={getConfirmInfo} placeholder="Confirme sua senha aqui" />
            </div>
            <button type="submit" onClick={cadastro} className="btn btn-primary col-md-12 mt-4">INSERIR</button>
        </div>
    );
}

export default InserirUser;