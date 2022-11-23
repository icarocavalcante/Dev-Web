import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FIREBASE_URL } from '../constants'
import Context from "../context"

function Cliente() {
    const [cliente, setCliente] = useState({ usuario: "", senha: "" })
    const [dbCliente, setDbCliente] = useState([])
    const [loading, setLoading] = useState(false)
    const { setAutenticado, setUser } = useContext(Context)
    const redirecionar = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        axios
            .get(`${FIREBASE_URL}/cliente.json`)
            .then(({ data, status }) => {
                if (status === 200) {
                    let retorno = Object.entries(data).map(([key, value]) => { return value })
                    setDbCliente(retorno)
                }
            })
            .catch((err) => alert(err))
            .finally(() => {
                setLoading(false)
            })

    }

    useEffect(() => {
        for (let index = 0; index < dbCliente.length; index++) {
            if (dbCliente[index].usuario === cliente.usuario && dbCliente[index].senha === cliente.senha) {
                setUser(dbCliente[index].nome)
                setAutenticado(true)
                alert(`Bem vindo(a), ${dbCliente[index].nome}`)
                redirecionar('/cliente/logado')
            }
        }
    }, [dbCliente])

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
                        <Link to="/cliente/new" className="btn btn-secondary mb-3">Novo Usuário</Link>
                        <Link to="/home" className="btn btn-danger mb-3">Voltar</Link>
                    </div>
                </form>
                {loading && <div className="container">Carregando ...</div>}
            </section>
        </div>
    )
}

function NovoCliente() {
    const [cliente, setCliente] = useState()
    const [loading, setLoading] = useState(false)
    const [novoUsuario, setNovoUsuario] = useState()
    const [dbUsuarios, setDbUsuarios] = useState()
    const redirecionar = useNavigate()

    useEffect(() => {
        setNovoUsuario(true)
        axios
            .get(`${FIREBASE_URL}/cliente.json`)
            .then(({ data, status }) => {
                if (status === 200) {
                    const retorno = Object.entries(data).map(([key, value]) => {return value})
                    setDbUsuarios(retorno)
                    setCliente({...cliente, id: retorno.length+1})
                }
            })
            .catch((err) => alert(err))
    }, [])

    useEffect(() => {
        if (dbUsuarios){
            let tamanho = dbUsuarios.length
            let contador = 0
            for (let index = 0; index < tamanho; index++) {
                if (dbUsuarios[index].usuario === cliente.usuario) {
                    contador++
                }
            }
            if (contador){
                setNovoUsuario(false)
            } else {
                setNovoUsuario(true)
            }
        }
    }, [cliente])
    
    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        if (!novoUsuario) {
            alert("Usuário já existe.")
            setLoading(false)
        } else if (cliente.usuario && cliente.senha && cliente.nome) {
            axios
            .post(`${FIREBASE_URL}/cliente.json`, cliente)
            .then(() => {
                alert(`Cadastro bem sucedido.`)
                redirecionar('/cliente')
            })
            .catch((err) => alert(err))
            .finally(() => {
                setLoading(false)
            })
        } else {
            alert("Preencha todos os campos do formulário.")
        }
    }

    return (
        <div className="container d-flex justify-content-center">
            <section className="card w-50 shadow my-5 text-center d-flex flex-column">
                <h4>Novo Cadastro</h4>
                <form action="" method="post" className="form" onSubmit={handleSubmit}>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtNome" className="form-label col-2">Nome</label>
                        <input type="text" className="form-control" id="txtNome" placeholder="Digite seu nome" onChange={({ target: { value } }) => setCliente({ ...cliente, nome: value })} />
                    </div>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtUsuario" className="form-label col-2">Usuário</label>
                        <input type="text" className="form-control" id="txtUsuario" placeholder="Digite seu usuário" onChange={({ target: { value } }) => setCliente({ ...cliente, usuario: value })} />
                    </div>
                    <div className="form-row d-flex flex-row align-items-center mb-2 container-fluid">
                        <label htmlFor="pwdSenha" className="form-label col-2">Senha</label>
                        <input type="password" className="form-control" id="pwdSenha" placeholder="Digite sua senha" onChange={({ target: { value } }) => setCliente({ ...cliente, senha: value })} />
                    </div>
                    <div className="container d-flex flex-row justify-content-around">
                        <input type="submit" className="btn btn-primary mb-3" value="Cadastrar" />
                        <Link to="/cliente" className="btn btn-danger mb-3">Voltar</Link>
                    </div>
                </form>
                {loading && <div className="container">Carregando ...</div>}
            </section>
        </div>
    )
}

function ClienteLogado() {
    const { autenticado, setAutenticado, user, setUser, tickets, setTickets } = useContext(Context)
    const redirecionar = useNavigate()

    function BuscarTickets() {
        if (autenticado) {
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
                .finally(() => setAutenticado(true))
        }
    }

    function Loggout() {
        setAutenticado(false)
        setUser("")
        alert(`Volte sempre, ${user}`)
        redirecionar('/cliente')
    }

    useEffect(() => BuscarTickets, [])

    return (
        <div className='container'>
            {autenticado &&
                <h1>Bem vindo, {`${user}`}</h1>
            }
            <div className="container">
                <nav className='my-3 navbar bg-light container-fluid'>
                    <table>
                        <thead>
                            <tr>
                                <td><Link to='/cliente/logado/new' className='navbar-brand'>Novo Ticket</Link></td>
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
                                if (el.usuario === user) {
                                    if (el.status === "Em aberto") {
                                        return (
                                            <tr key={ix}>
                                                <td><Link className='text-danger' to={`/cliente/logado/${el.key}`}>{el.assunto}</Link></td>
                                                <td><Link className='text-danger' to={`/cliente/logado/${el.key}`}>{el.dtAbertura}</Link></td>
                                                <td><Link className='text-danger' to={`/cliente/logado/${el.key}`}>{el.id}</Link></td>
                                                <td><Link className='text-danger' to={`/cliente/logado/${el.key}`}>{el.dtConclusao}</Link></td>
                                                <td><Link className='text-danger' to={`/cliente/logado/${el.key}`}>{el.operador}</Link></td>
                                                <td><Link className='text-danger' to={`/cliente/logado/${el.key}`}>{el.status}</Link></td>
                                            </tr>
                                        )

                                    } else if (el.status === "Concluído") {
                                        return (
                                            <tr key={ix}>
                                                <td><Link className='text-success' to={`/cliente/logado/${el.key}`}>{el.id}</Link></td>
                                                <td><Link className='text-success' to={`/cliente/logado/${el.key}`}>{el.assunto}</Link></td>
                                                <td><Link className='text-success' to={`/cliente/logado/${el.key}`}>{el.dtAbertura}</Link></td>
                                                <td><Link className='text-success' to={`/cliente/logado/${el.key}`}>{el.dtConclusao}</Link></td>
                                                <td><Link className='text-success' to={`/cliente/logado/${el.key}`}>{el.operador}</Link></td>
                                                <td><Link className='text-success' to={`/cliente/logado/${el.key}`}>{el.status}</Link></td>
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
    const { ticket, setTicket, user } = useContext(Context)
    const redirecionar = useNavigate()
    const [defaultTicket, setDefaultTicket] = useState({
        id: "",
        usuario: "",
        status: "",
        dtAbertura: "",
        dtConclusao: "",
        assunto: "",
        descricao: "",
        operador: "",
    })

    function handleSubmitForm(e) {
        e.preventDefault()
        axios
            .post(`${FIREBASE_URL}/tickets.json`, ticket)
            .then(() => {
                alert(`Ticket criado. ID: ${ticket.id}`)
                setTicket(defaultTicket)
                redirecionar('/cliente/logado')
            })
            .catch((err) => alert(err))
    }

    useEffect(() => {
        setTicket(defaultTicket);
        axios
            .get(`${FIREBASE_URL}/tickets.json`)
            .then(({ data, status }) => {
                if (status === 200) {
                    const d = Object.entries(data)
                    let time = new Date();
                    let agora = time.toLocaleString();
                    setTicket({
                        ...ticket,
                        id: d.length+1,
                        usuario: user,
                        status: "Em aberto",
                        dtConclusao: "",
                        assunto: "",
                        descricao: "",
                        operador: "",
                        dtAbertura: agora
                    })
                }
            })
            .catch((err) => alert(err))
    }, [])

    return (
        <div className="container">
            <section>
                <h5 className='mt-2'>Novo Cadastro</h5>
                <form method="post" onSubmit={handleSubmitForm} >
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtAssunto" className="form-label col-2">Assunto</label>
                        <input type="text" className="form-control" id="txtAssunto" onChange={({ target: { value } }) => setTicket({ ...ticket, assunto: value })} />
                    </div>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtDescricao" className="form-label col-2">Descricao</label>
                        <textarea rows={5} className="form-control" id="txtDescricao" onChange={({ target: { value } }) => setTicket({ ...ticket, descricao: value })} />
                    </div>
                    <div className="container d-flex flex-row justify-content-around">
                        <input type="submit" className="btn btn-primary mb-3" value="Cadastrar" />
                        <Link to="/cliente/logado" className="btn btn-danger mb-3">Voltar</Link>
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
                    <Link to="/cliente/logado" className="btn btn-danger mt-3">Voltar</Link>
                </section>
            </div>
        </div>
    )
}

export { Cliente, NovoCliente, ClienteLogado, NovoTicket, ClienteTickets }