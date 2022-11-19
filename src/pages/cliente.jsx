import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FIREBASE_URL } from '../constants'
import Context from "../context"

function Cliente() {
    const [cliente, setCliente] = useState({ usuario: "", senha: "" })
    const [dbCliente, setDbCliente] = useState([])
    const [loading, setLoading] = useState(false)
    const { clienteAutenticado, setClienteAutenticado, atualCliente, setAtualCliente } = useContext(Context)
    const redirecionar = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        axios
            .get(`${FIREBASE_URL}/cliente.json`)
            .then(({ data, status }) => {
                if (status === 200) {
                    const retorno = Object
                        .entries(data)
                    setDbCliente(retorno)
                } else {
                    setDbCliente([])
                }
            })
            .catch((err) => alert(err))
            .finally(() => {
                setLoading(false)
            })

    }

    useEffect(() => {
        setClienteAutenticado(false)
        for (let index = 0; index < dbCliente.length; index++) {
            if (dbCliente[index][1].usuario === cliente.usuario && dbCliente[index][1].senha === cliente.senha) {
                setAtualCliente(`${cliente.usuario}`)
                setClienteAutenticado(true)
            }
        }
    }, [dbCliente, cliente.usuario, cliente.senha, setClienteAutenticado])

    useEffect(() => {
        if (clienteAutenticado) {
            alert(`Bem vindo(a), ${atualCliente}`)
            redirecionar('/login/cliente/logado')
        }
    }, [clienteAutenticado, cliente.usuario, redirecionar])

    return (
        <div className="container d-flex justify-content-center">
            <section className="card w-50 shadow my-5 text-center d-flex flex-column">
                <h4>Login - Cliente</h4>
                <form action="" method="post" className="form" onSubmit={handleSubmit}>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtUsuario" className="form-label col-2">Usuário</label>
                        <input type="text" className="form-control" id="txtUsuario" onChange={({ target: { value } }) => setCliente({ ...cliente, usuario: value })} />
                    </div>
                    <div className="form-row d-flex flex-row align-items-center mb-2 container-fluid">
                        <label htmlFor="pwdSenha" className="form-label col-2">Senha</label>
                        <input type="password" className="form-control" id="pwdSenha" onChange={({ target: { value } }) => setCliente({ ...cliente, senha: value })} />
                    </div>
                    <div className="container d-flex flex-row justify-content-around">
                        <input type="submit" className="btn btn-primary mb-3" value="Acessar" />
                        <Link to="/login/cliente/new" className="btn btn-secondary mb-3">Novo Usuário</Link>
                        <Link to="/home" className="btn btn-danger mb-3">Voltar</Link>
                    </div>
                </form>
                {loading && <div className="container">Carregando ...</div>}
            </section>
        </div>
    )
}

function NovoCliente() {
    const [cliente, setCliente] = useState({ usuario: "", senha: "" })
    const [loading, setLoading] = useState(false)
    const [novoUsuario, setNovoUsuario] = useState(true)
    const [dbUsuario, setDbUsuario] = useState("")
    const redirecionar = useNavigate()

    useEffect(() => {
        axios
            .get(`${FIREBASE_URL}/cliente.json`)
            .then(({ data, status }) => {
                if (status === 200) {
                    const retorno = Object
                        .entries(data)
                    setDbUsuario(retorno)
                } else {
                    setDbUsuario([])
                }
            })
            .catch((err) => alert(err))
    }, [cliente.usuario])

    useEffect(() => {
        for (let index = 0; index < dbUsuario.length; index++) {
            if (dbUsuario[index][1].usuario === cliente.usuario) {
                setNovoUsuario(false)
            }
        }
    }, [cliente.usuario, dbUsuario])

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        if (!novoUsuario) {
            alert("Usuário já existe.")
            setLoading(false)
        } else {
            axios
                .post(`${FIREBASE_URL}/cliente.json`, cliente)
                .then(({ data }) => {
                    alert(`Cadastro bem sucedido. Salve o ID: ${data.name}`)
                    redirecionar('/cliente')
                })
                .catch((err) => alert(err))
                .finally(() => {
                    setLoading(false)
                })
        }
    }


    return (
        <div className="container d-flex justify-content-center">
            <section className="card w-50 shadow my-5 text-center d-flex flex-column">
                <h4>Novo Cadastro</h4>
                <form action="" method="post" className="form" onSubmit={handleSubmit}>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtUsuario" className="form-label col-2">Usuário</label>
                        <input type="text" className="form-control" id="txtUsuario" onChange={({ target: { value } }) => setCliente({ ...cliente, usuario: value })} />
                    </div>
                    <div className="form-row d-flex flex-row align-items-center mb-2 container-fluid">
                        <label htmlFor="pwdSenha" className="form-label col-2">Senha</label>
                        <input type="password" className="form-control" id="pwdSenha" onChange={({ target: { value } }) => setCliente({ ...cliente, senha: value })} />
                    </div>
                    <div className="container d-flex flex-row justify-content-around">
                        <input type="submit" className="btn btn-primary mb-3" value="Cadastrar" />
                        <Link to="/login/cliente" className="btn btn-danger mb-3">Voltar</Link>
                    </div>
                </form>
                {loading && <div className="container">Carregando ...</div>}
            </section>
        </div>
    )
}

function ClienteLogado() {
    const { clienteAutenticado, setClienteAutenticado, atualCliente, tickets, setTickets } = useContext(Context)
    const redirecionar = useNavigate()

    async function BuscarTickets() {
        if (clienteAutenticado) {
            axios
                .get(`${FIREBASE_URL}/tickets.json`)
                .then(({ data, status }) => {
                    if (status === 200) {
                        const retorno = Object.entries(data).map(([key, value]) => { return { ...value, key: key } })
                        setTickets(retorno)
                    } else {
                        setTickets([])
                    }
                })
                .catch((err) => alert(err))
                .finally(() => setClienteAutenticado(true))
        }
    }

    function Loggout() {
        setClienteAutenticado(false)
        alert(`Volte sempre, ${atualCliente}`)
        redirecionar('/')
    }

    useEffect(() => BuscarTickets, [clienteAutenticado])

    return (
        <div className='container'>
            {clienteAutenticado &&
                <h1>Bem vindo, {`${atualCliente}`}</h1>
            }
            <div className="container">
                <nav className='my-3 navbar bg-light container-fluid'>
                    <table>
                        <thead>
                            <tr>
                                <td><Link to='/login/cliente/logado/new' className='navbar-brand'>Novo Ticket</Link></td>
                                <td></td>
                            </tr>
                        </thead>
                    </table>
                </nav>

                <section>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Assunto</th>
                                <th>Data de Abertura</th>
                                <th>Data de Conclusao</th>
                                <th>Operador</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map((el, ix) => {
                                if (el.usuario === atualCliente) {
                                    if (el.status === "Em aberto") {
                                        return (
                                            <tr key={ix}>
                                                <td><Link className='text-danger' to={`/login/cliente/logado/${el.key}`}>{el.id}</Link></td>
                                                <td><Link className='text-danger' to={`/login/cliente/logado/${el.key}`}>{el.assunto}</Link></td>
                                                <td><Link className='text-danger' to={`/login/cliente/logado/${el.key}`}>{el.dtAbertura}</Link></td>
                                                <td><Link className='text-danger' to={`/login/cliente/logado/${el.key}`}>{el.dtConclusao}</Link></td>
                                                <td><Link className='text-danger' to={`/login/cliente/logado/${el.key}`}>{el.operador}</Link></td>
                                                <td><Link className='text-danger' to={`/login/cliente/logado/${el.key}`}>{el.status}</Link></td>
                                            </tr>
                                        )

                                    } else if (el.status === "Concluído") {
                                        return (
                                            <tr key={ix}>
                                                <td><Link className='text-success' to={`/login/cliente/logado/${el.key}`}>{el.id}</Link></td>
                                                <td><Link className='text-success' to={`/login/cliente/logado/${el.key}`}>{el.assunto}</Link></td>
                                                <td><Link className='text-success' to={`/login/cliente/logado/${el.key}`}>{el.dtAbertura}</Link></td>
                                                <td><Link className='text-success' to={`/login/cliente/logado/${el.key}`}>{el.dtConclusao}</Link></td>
                                                <td><Link className='text-success' to={`/login/cliente/logado/${el.key}`}>{el.operador}</Link></td>
                                                <td><Link className='text-success' to={`/login/cliente/logado/${el.key}`}>{el.status}</Link></td>
                                            </tr>
                                        )

                                    }
                                }
                            })
                            }
                        </tbody>
                    </table>
                </section>
                <section className='container d-flex justify-content-around'>
                    <button className='btn btn-secondary mt-3' onClick={BuscarTickets} >Atualizar</button>
                    <button onClick={Loggout} className="btn btn-danger mt-3">Sair</button>
                </section>
            </div>
        </div>
    )
}

function NovoTicket() {
    const { ticket, setTicket, atualCliente, defaultTicket, contador, setContador } = useContext(Context)
    const redirecionar = useNavigate()

    function handleSubmitForm(e) {
        e.preventDefault()

        axios
            .post(`${FIREBASE_URL}/contador.json`, ticket)
            .catch((err) => alert(err))

        axios
            .post(`${FIREBASE_URL}/tickets.json`, ticket)
            .then(() => {
                alert(`Ticket criado. ID: ${ticket.id}`)
                redirecionar('/login/cliente/logado')
            })
            .catch((err) => alert(err))
            .finally(() => {
                setTicket(defaultTicket)
            })
    }

    function BuscaContador() {
        axios
            .get(`${FIREBASE_URL}/contador.json`)
            .then(({ data, status }) => {
                if (status === 200) {
                    const d = Object.entries(data).map((key, value) => { return { ...value } })
                    setContador(d)
                }
            })
            .catch((err) => alert(err))
    }


    function AlteraAssunto(assunto) {
        BuscaContador()
        setTicket({ assunto: assunto.target.value, descricao: `${ticket.descricao}`, usuario: `${atualCliente}`, status: "Em aberto", id: contador.length + 1, dtAbertura: dataHora(), dtConclusao: "", operador: "", resposta: "" })
    }

    function AlteraDescricao(descricao) {
        BuscaContador()
        setTicket({ assunto: `${ticket.assunto}`, descricao: descricao.target.value, usuario: `${atualCliente}`, status: "Em aberto", id: contador.length + 1, dtAbertura: dataHora(), dtConclusao: "", operador: "", resposta: "" })
    }

    const dataHora = () => {
        let time = new Date()
        let dataHora = time.toLocaleString()
        return dataHora
    }



    return (
        <div className="container">
            <section>
                <h5 className='mt-2'>Novo Cadastro</h5>
                <form method="post" onSubmit={handleSubmitForm} >
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtAssunto" className="form-label col-2">Assunto</label>
                        <input type="text" className="form-control" id="txtAssunto" onChange={AlteraAssunto} />
                    </div>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtDescricao" className="form-label col-2">Descricao</label>
                        <textarea rows={5} className="form-control" id="txtDescricao" onChange={AlteraDescricao} />
                    </div>
                    <div className="container d-flex flex-row justify-content-around">
                        <input type="submit" className="btn btn-primary mb-3" value="Cadastrar" />
                        <Link to="/login/cliente/logado" className="btn btn-danger mb-3">Voltar</Link>
                    </div>
                </form>
            </section>
        </div>
    )
}

function ClienteTickets() {
    const { clienteAutenticado, atualCliente, ticket, setTicket } = useContext(Context)
    const { key } = useParams()

    useEffect(() => {
        if (key) {
            axios
                .get(`${FIREBASE_URL}/tickets/${key}.json`)
                .then(({ data }) => { setTicket(data) })
                .catch((err) => alert(err))
        }
    }, [key])

    return (
        <div className='container'>
            {clienteAutenticado &&
                <h1>Cliente: {`${atualCliente}`}</h1>
            }
            <div className="container">
                <nav className='my-3 navbar bg-light container-fluid'>
                    <table>
                        <thead>
                            <tr>
                                <td className='navbar-brand'>Ticket - {`${ticket.assunto}`}</td>
                            </tr>
                        </thead>
                    </table>
                </nav>


                <section>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuário</th>
                                <th>Status</th>
                                <th>Data de Abertura</th>
                                <th>Data de Conclusao</th>
                                <th>Operador</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{ticket.id}</td>
                                <td>{ticket.usuario}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.dtAbertura}</td>
                                <td>{ticket.dtConclusao}</td>
                                <td>{ticket.operador}</td>
                            </tr>
                        </tbody>
                    </table>
                </section>

                <section>
                    <label className="form-label" htmlFor="txtDescricao">Descrição do Ticket</label>
                    <textarea className='form-control' id="textDescricao" rows={5} value={`${ticket.descricao}`} />
                    <label className="form-label" htmlFor="txtResposta">Resposta do Operador</label>
                    <textarea className='form-control' id="txtResposta" rows={5} value={`${ticket.resposta}`} />
                </section>
                <section className='container d-flex justify-content-center'>
                    <Link to="/login/cliente/logado" className="btn btn-danger mt-3">Voltar</Link>
                </section>
            </div>
        </div>
    )
}

export { Cliente, NovoCliente, ClienteLogado, NovoTicket, ClienteTickets }