import { useContext } from 'react'
import Context from '../../../../context'

const SuporteLogado = () => {
    const {suporteAutenticado} = useContext(Context)

    return (
        <div>
            {suporteAutenticado &&
                <h1>Autenticado</h1>
            }
        </div>
    )
}

export default SuporteLogado