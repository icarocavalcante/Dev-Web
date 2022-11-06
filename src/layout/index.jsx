import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div className="container">
            <div className="card card-shadow my-10">
                <div className="card-header">
                    <h3>Sistema de Suporte</h3>
                </div>
                <div className="card-body">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout