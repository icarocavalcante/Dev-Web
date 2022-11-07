import { Link } from "react-router-dom"

const Home = () => {
    return(
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header text-center">
                    <h2>Escolha o seu perfil</h2>
                </div>
                <div className="card-body">
                    <table className="table text-center">
                        <tbody>
                            <tr>
                                <td>
                                    <Link to='/login/cliente'>Cliente</Link>
                                </td>
                                <td>
                                    <Link to='/login/suporte'>Suporte</Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Home