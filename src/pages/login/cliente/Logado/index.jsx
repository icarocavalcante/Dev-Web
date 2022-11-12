import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Context from '../../../../context'
import { FIREBASE_URL } from '../../../../constants'
import { Link, useNavigate } from 'react-router-dom'

const ClienteLogado = () => {
    const { clienteAutenticado, setClienteAutenticado, atualCliente, tickets, setTickets } = useContext(Context)

    async function BuscarTickets() {
        if (clienteAutenticado) {
            axios
                .get(`${FIREBASE_URL}/tickets.json`)
                .then(({ data, status }) => {
                    if (status === 200) {
                        const retorno = Object.entries(data).map(([key, value]) => { return {...value}})
                        setTickets(retorno)
                    } else {
                        setTickets([])
                    }
                })
                .catch((err) => alert(err))
                .finally(() => setClienteAutenticado(true))
        }
    }

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
                                 <td><Link to='/login/cliente/logado/new'className='navbar-brand'>Novo Ticket</Link></td>
                                 <td><button className='btn btn-secondary' onClick={BuscarTickets} >Atualizar</button></td>
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
                        {tickets.map((el, ix) => {
                            if (el.usuario === atualCliente) {
                                return (
                                    <tr key={ix}>
                                        <td>{el.id}</td>
                                        <td>{el.usuario}</td>
                                        <td>{el.status}</td>
                                        <td>{el.dtAbertura}</td>
                                        <td>{el.dtConclusao}</td>
                                        <td>{el.operador}</td>
                                    </tr>
                                )
                            }
                        })
                        }
                    </tbody>
                </table>
                </section>
            </div>
        </div>
    )
}

export function NovoTicket () {
    const {ticket, setTicket, atualCliente, defaultTicket, contador, setContador} = useContext(Context)
    const redirecionar = useNavigate()

    function handleSubmitForm(e){
        e.preventDefault()
        
        axios
        .post(`${FIREBASE_URL}/tickets.json`, ticket)
        .then(({data}) => {
            alert(`Ticket criado. ID: ${ticket.id}`)
            redirecionar('/login/cliente/logado')
        })
        .catch((err) => alert(err))
        .finally(()=> {
            setTicket(defaultTicket)
        })
    }
    
    function BuscaContador() {
        axios
            .get(`${FIREBASE_URL}/tickets.json`)
            .then(({data, status}) => {
                if (status === 200) {
                    const d = Object.entries(data).map((key, value) => { return {...value} })
                    setContador(d)
                }
            })
            .catch((err) => alert(err))
    }

    function AlteraAssunto(assunto) {
        BuscaContador()
        setTicket({assunto: assunto.target.value, descricao: `${ticket.descricao}`, usuario: `${atualCliente}`, status: "Em aberto", id: contador.length +1 , dtAbertura: Date.now(), dtConclusao: "", operador: ""})
    }
    
    function AlteraDescricao(descricao) {
        BuscaContador()
        setTicket({assunto: `${ticket.assunto}`, descricao: descricao.target.value, usuario: `${atualCliente}`, status: "Em aberto", id: contador.length +1, dtAbertura: Date.now(), dtConclusao: "", operador: ""})
    }

    return (
        <div className="container">
            <section>
                <h5 className='mt-2'>Novo Cadastro</h5>
                <form method="post" onSubmit={handleSubmitForm} >
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtAssunto" className="form-label col-2">Assunto</label>
                        <input type="text" className="form-control" id="txtAssunto" onChange={AlteraAssunto}/>
                    </div>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtDescricao" className="form-label col-2">Descricao</label>
                        <textarea rows={5} className="form-control" id="txtDescricao" onChange={AlteraDescricao}/>
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

export default ClienteLogado