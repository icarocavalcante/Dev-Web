import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { FIREBASE_URL } from '../constants'
import Context from "../context"
import DbConn from '../database/dbconn'
import { ref, get, child, set } from 'firebase/database'


const dataHora = () => {
    let time = new Date()
    let dataHora = time.toLocaleString()
    return dataHora
}

function Suporte() {
    const { suporteAutenticado, setSuporteAutenticado, atualSuporte, setAtualSuporte, tickets, setTickets, ticket, setTicket } = useContext(Context)
    const [suporte, setSuporte] = useState({ usuario: "", senha: "" })
    const [dbSuporte, setDbSuporte] = useState([])
    const [loading, setLoading] = useState(false)
    const redirecionar = useNavigate()
    
    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        axios
            .get(`${FIREBASE_URL}/suporte.json`)
            .then(({ data, status }) => {
                if (status === 200) {
                    const retorno = Object
                        .entries(data)
                    setDbSuporte(retorno)
                } else {
                    setDbSuporte([])
                }
            })
            .catch((err) => alert(err))
            .finally(() => {
                setLoading(false)
            })

    }

    useEffect(() => {
        setSuporteAutenticado(false)
        for (let index = 0; index < dbSuporte.length; index++) {
            if (dbSuporte[index][1].usuario === suporte.usuario && dbSuporte[index][1].senha === suporte.senha) {
                setAtualSuporte(`${suporte.usuario}`)
                setSuporteAutenticado(true)
            }
        }
    }, [dbSuporte, suporte.senha, suporte.usuario, setSuporteAutenticado])

    useEffect(() => {
        if (suporteAutenticado) {
            alert(`Bem vindo(a), ${atualSuporte}`)
            redirecionar('/login/suporte/logado')
        }
    }, [suporteAutenticado, suporte.usuario, redirecionar])

    return (
        <div className="container d-flex justify-content-center">
            <section className="card w-50 shadow my-5 text-center d-flex flex-column">
                <h4>Login - Suporte</h4>
                <form action="" method="post" className="form" onSubmit={handleSubmit}>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtUsuario" className="form-label col-2">Usuário</label>
                        <input type="text" className="form-control" id="txtUsuario" onChange={({ target: { value } }) => setSuporte({ ...suporte, usuario: value })} />
                    </div>
                    <div className="form-row d-flex flex-row align-items-center mb-2 container-fluid">
                        <label htmlFor="pwdSenha" className="form-label col-2">Senha</label>
                        <input type="password" className="form-control" id="pwdSenha" onChange={({ target: { value } }) => setSuporte({ ...suporte, senha: value })} />
                    </div>
                    <div className="container d-flex flex-row justify-content-around">
                        <input type="submit" className="btn btn-primary mb-3" value="Acessar" />
                        <Link to="/home" className="btn btn-danger mb-3">Voltar</Link>
                    </div>
                </form>
                {loading && <div className="container">Carregando ...</div>}

            </section>
        </div>
    )
}

function SuporteLogado() {
    const { suporteAutenticado, setSuporteAutenticado, atualSuporte, setAtualSuporte, tickets, setTickets, ticket, setTicket } = useContext(Context)
    const redirecionar = useNavigate()
    
    async function BuscarTickets() {
        if (suporteAutenticado) {
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
                .finally(() => setSuporteAutenticado(true))
        }
    }

    function Loggout() {
        setSuporteAutenticado(false)
        alert(`Volte sempre, ${atualSuporte}`)
        redirecionar('/')
    }

    useEffect(() => BuscarTickets, [suporteAutenticado])

    return (
        <div>
            {suporteAutenticado &&
                <h1>Bem vindo, {`${atualSuporte}`}</h1>
            }
            <div className="container">

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
                                if (el.status === "Em aberto") {
                                    return (
                                        <tr key={ix}>
                                            <td><Link className='text-danger' to={`/login/suporte/logado/${el.key}`}>{el.id}</Link></td>
                                            <td><Link className='text-danger' to={`/login/suporte/logado/${el.key}`}>{el.assunto}</Link></td>
                                            <td><Link className='text-danger' to={`/login/suporte/logado/${el.key}`}>{el.dtAbertura}</Link></td>
                                            <td><Link className='text-danger' to={`/login/suporte/logado/${el.key}`}>{el.dtConclusao}</Link></td>
                                            <td><Link className='text-danger' to={`/login/suporte/logado/${el.key}`}>{el.operador}</Link></td>
                                            <td><Link className='text-danger' to={`/login/suporte/logado/${el.key}`}>{el.status}</Link></td>
                                        </tr>
                                    )
                                } else if (el.status === "Concluído") {
                                    return (
                                        <tr key={ix}>
                                            <td><Link className='text-success' to={`/login/suporte/logado/${el.key}`}>{el.id}</Link></td>
                                            <td><Link className='text-success' to={`/login/suporte/logado/${el.key}`}>{el.assunto}</Link></td>
                                            <td><Link className='text-success' to={`/login/suporte/logado/${el.key}`}>{el.dtAbertura}</Link></td>
                                            <td><Link className='text-success' to={`/login/suporte/logado/${el.key}`}>{el.dtConclusao}</Link></td>
                                            <td><Link className='text-success' to={`/login/suporte/logado/${el.key}`}>{el.operador}</Link></td>
                                            <td><Link className='text-success' to={`/login/suporte/logado/${el.key}`}>{el.status}</Link></td>
                                        </tr>
                                    )
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

function SuporteTickets() {
    const { key } = useParams()
    const redirecionar = useNavigate()
    const { suporteAutenticado, setSuporteAutenticado, atualSuporte, setAtualSuporte, tickets, setTickets, ticket, setTicket } = useContext(Context)

    useEffect(function RecuperaTickets() {
        if (key) {
            const db = DbConn()

            const posts = ref(db);

            get(child(posts, `tickets/${key}`)).then((snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    setTicket(data);
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
        }
    }, [key])

    function AlterarResposta(resposta) {
        setTicket({ ...ticket, resposta: resposta.target.value })
        SalvarTicket()
    }

    function SalvarTicket() {
        setTicket({ assunto: ticket.assunto, descricao: ticket.descricao, usuario: ticket.usuario, status: "Concluído", id: ticket.id, dtAbertura: ticket.dtAbertura, dtConclusao: dataHora(), operador: atualSuporte, resposta: ticket.resposta })
        console.log("alterado")
    }

    function ConcluirTicket() {
        const db = DbConn()
        const posts = ref(db)
        set(child(posts, `tickets/${key}`), ticket).then(() => console.log("Salvo")).catch((err) => alert(err))
    }

    function ExcluirTicket() {
        const db = DbConn()
        const posts = ref(db)
        set(child(posts, `tickets/${key}`), null).then(() => console.log("Salvo")).catch((err) => alert(err))
        redirecionar('/login/suporte/logado')
        key = null
    }

    return (
        <div className='container'>
            {suporteAutenticado &&
                <h1>Suporte: {`${atualSuporte}`}</h1>
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
                    <textarea className='form-control' id="txtResposta" rows={5} placeholder={`${ticket.resposta}`} onChange={AlterarResposta} />
                </section>
                <section className='container d-flex justify-content-between'>
                    <button onClick={ConcluirTicket} className="btn btn-success mt-3">Concluir</button>
                    <button onClick={ExcluirTicket} className="btn btn-danger mt-3">Excluir</button>
                    <Link to="/login/suporte/logado" className="btn btn-secondary mt-3">Voltar</Link>
                </section>
            </div>
        </div>
    )
}

export { Suporte, SuporteLogado, SuporteTickets }