import { useState } from "react"
import { Link, Outlet } from "react-router-dom"
import Context from "../context"


const Layout = () => {
    
    const [clienteAutenticado, setClienteAutenticado] = useState()
    const [suporteAutenticado, setSuporteAutenticado] = useState()
    const [atualCliente, setAtualCliente] = useState()
    const [atualSuporte, setAtualSuporte] = useState()
    const [ticket, setTicket] = useState({
        id: "",
        usuario: "",
        status: "",
        dtAbertura: "",
        dtConclusao: "",
        assunto: "",
        descricao: "",
        operador: ""
    })
    const [defaultTicket, setDefaultTicket] = useState([])
    const [tickets, setTickets] = useState([])
    const [contador, setContador] = useState([])

    return (
        <Context.Provider value={{atualCliente,
        setAtualCliente,
        atualSuporte,
        setAtualSuporte,
        clienteAutenticado,
        setClienteAutenticado,
        suporteAutenticado,
        setSuporteAutenticado,
        ticket,
        setTicket,
        defaultTicket,
        setDefaultTicket,
        tickets,
        setTickets,
        contador,
        setContador
        }}>

            <div className="d-flex flex-column vh-100" style={{flex: 1}}>
                
                <header>
                    <div className="container">
                        <nav className="navbar bg-light navbar-expand-lg">
                            <div className="container-fluid">
                                <Link className="navbar-brand" to='/'>Home</Link>
                            </div>
                        </nav>
                    </div>
                </header>
                
                <main>
                    <div className="container">
                        <Outlet />
                    </div>
                </main>
                <footer className="mt-5">
                    <div className="container text-center">
                        <p>Desenvolvido na disciplina de Desenvolvimento Web</p>
                        <p>Thiago e Ícaro</p>
                        <p>&copy; 2022 - Estacio</p>
                    </div>
                </footer>
            </div> 
        </Context.Provider>
        )
    }

export default Layout