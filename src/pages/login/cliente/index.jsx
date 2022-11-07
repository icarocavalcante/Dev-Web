import axios from "axios"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FIREBASE_URL } from '../../../constants'

const Cliente = () => {
    const [cliente, setCliente] = useState({usuario: "", senha: ""})
    const [dbCliente, setDbCliente] = useState([])
    const [loading, setLoading] = useState(false)
    const [autenticado, setAutenticado] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = (e)=>{
        e.preventDefault()
        setLoading(true)

        axios
        .get(`${FIREBASE_URL}/cliente.json`)
        .then(({data, status}) => {
            if (status === 200){
                const retorno = Object
                    .entries(data)
                setDbCliente(retorno)
            } else {
                setDbCliente([])
                setAutenticado(false)
            }
            })
            .catch((err) => alert(err))
            .finally(() => {
                setLoading(false)
            })

        }

        useEffect(() => {
            for (let index = 0; index < dbCliente.length; index++) {
                if (dbCliente[index][1].usuario === cliente.usuario && dbCliente[index][1].senha === cliente.senha) {
                    setAutenticado(true)
                }
            }
        },[dbCliente])

        useEffect(() => {
            if (autenticado) {
                alert(`Bem vindo(a), ${cliente.usuario}`)
                navigate("/home")
            }
        },[autenticado])

    return (
        <div className="container d-flex justify-content-center">
            {loading && <div className="container">Carregando ...</div>}
            <section className="card w-50 shadow my-5 text-center d-flex flex-column">
                <h4>Login</h4>
                <form action="" method="post" className="form" onSubmit={handleSubmit}>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtUsuario" className="form-label col-2">Usuário</label>
                        <input type="text" className="form-control" id="txtUsuario" onChange={({target: {value}}) => setCliente({...cliente, usuario: value})}/>
                    </div>
                    <div className="form-row d-flex flex-row align-items-center mb-2 container-fluid">
                        <label htmlFor="pwdSenha" className="form-label col-2">Senha</label>
                        <input type="password" className="form-control" id="pwdSenha" onChange={({target: {value}}) => setCliente({...cliente, senha: value})}/>
                    </div>
                    <div className="container d-flex flex-row justify-content-around">
                        <input type="submit" className="btn btn-primary mb-3" value="Acessar" />
                        <Link to="/login/cliente/new" className="btn btn-secondary mb-3">Novo Usuário</Link>
                        <Link to="/home" className="btn btn-danger mb-3">Voltar</Link>
                    </div>
                </form>
            </section>
            {/* <table className="table table-striped">
                <tbody>
                    {dbCliente.map((el, ix) => {
                        return(
                            <tr key={ix}>
                                <td>{el[1].usuario}</td>
                                <td>{el[1].senha}</td>
                            </tr>
                        )
                        })
                    }
                </tbody>
                </table> */}
        </div>
    )
}

const NovoCliente = () => {
    const [cliente, setCliente] = useState({usuario: "", senha: ""})
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e)=>{
        e.preventDefault()
        setLoading(true)
        axios
            .post(`${FIREBASE_URL}/cliente.json`, cliente)
            .then(({data}) => alert(`Cadastro bem sucedido. Salve o ID: ${data.name}`))
            .catch((err) => alert(err))
            .finally(setLoading(false))
    }


    return (
        <div className="container d-flex justify-content-center">
            {loading && <div className="container">Carregando ...</div>}
            <section className="card w-50 shadow my-5 text-center d-flex flex-column">
                <h4>Novo Cadastro</h4>
                <form action="" method="post" className="form" onSubmit={handleSubmit}>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtUsuario" className="form-label col-2">Usuário</label>
                        <input type="text" className="form-control" id="txtUsuario" onChange={({target: {value}}) => setCliente({...cliente, usuario: value})}/>
                    </div>
                    <div className="form-row d-flex flex-row align-items-center mb-2 container-fluid">
                        <label htmlFor="pwdSenha" className="form-label col-2">Senha</label>
                        <input type="password" className="form-control" id="pwdSenha" onChange={({target: {value}}) => setCliente({...cliente, senha: value})}/>
                    </div>
                    <div className="container d-flex flex-row justify-content-around">
                        <input type="submit" className="btn btn-primary mb-3" value="Cadastrar" />
                        <Link to="/login/cliente" className="btn btn-danger mb-3">Voltar</Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

export {Cliente, NovoCliente}