import { Link, Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div className="d-flex flex-column vh-100" style={{flex: 1}}>
            
            <header>
                <div className="container">
                    <nav className="navbar bg-light navbar-expand-lg">
                        <div className="container-fluid">
                            <Link className="navbar-brand" to='/'>Sistema de Suporte</Link>
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
    )
}

export default Layout