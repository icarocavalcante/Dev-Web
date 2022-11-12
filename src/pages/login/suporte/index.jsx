import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FIREBASE_URL } from '../../../constants'
import Context from "../../../context"

const Suporte = () => {
    const [suporte, setSuporte] = useState({usuario: "", senha: ""})
    const [dbSuporte, setDbSuporte] = useState([])
    const [loading, setLoading] = useState(false)
    const {suporteAutenticado, setSuporteAutenticado, atualSuporte, setAtualSuporte} = useContext(Context)
    const redirecionar = useNavigate()

    const handleSubmit = (e)=>{
        e.preventDefault()
        setLoading(true)

        axios
        .get(`${FIREBASE_URL}/suporte.json`)
        .then(({data, status}) => {
            if (status === 200){
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
        },[dbSuporte, suporte.senha, suporte.usuario, setSuporteAutenticado ])

        useEffect(() => {
            if (suporteAutenticado) {
                alert(`Bem vindo(a), ${atualSuporte}`)
                redirecionar('/login/suporte/logado')
            }
        },[suporteAutenticado, suporte.usuario, redirecionar])

    return (
        <div className="container d-flex justify-content-center">
            <section className="card w-50 shadow my-5 text-center d-flex flex-column">
                <h4>Login - Suporte</h4>
                <form action="" method="post" className="form" onSubmit={handleSubmit}>
                    <div className="form-row d-flex flex-row align-items-center my-3 container-fluid">
                        <label htmlFor="txtUsuario" className="form-label col-2">Usuário</label>
                        <input type="text" className="form-control" id="txtUsuario" onChange={({target: {value}}) => setSuporte({...suporte, usuario: value})}/>
                    </div>
                    <div className="form-row d-flex flex-row align-items-center mb-2 container-fluid">
                        <label htmlFor="pwdSenha" className="form-label col-2">Senha</label>
                        <input type="password" className="form-control" id="pwdSenha" onChange={({target: {value}}) => setSuporte({...suporte, senha: value})}/>
                    </div>
                    <div className="container d-flex flex-row justify-content-around">
                        <input type="submit" className="btn btn-primary mb-3" value="Acessar" />
                        <Link to="/home" className="btn btn-danger mb-3">Voltar</Link>
                    </div>
                </form>
                {loading && <div className="container">Carregando ...</div>}

            </section>
            {/* <table className="table table-striped">
                <tbody>
                    {dbSuporte.map((el, ix) => {
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

export default Suporte