import { useContext } from 'react'
import Context from '../../../../context'

const ClienteLogado = () => {
    const {autenticado} = useContext(Context)

    return (
        <div>
            {autenticado &&
                <h1>Autenticado</h1>
            }
        </div>
    )
}

export default ClienteLogado