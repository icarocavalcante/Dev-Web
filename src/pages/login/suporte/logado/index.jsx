import { useContext } from 'react'
import Context from '../../../../context'

const SuporteLogado = () => {
    const {suporteAutenticado, atualSuporte} = useContext(Context)

    return (
        <div>
            {suporteAutenticado &&
                <h1>Autenticado - {`${atualSuporte}`}</h1>
            }
        </div>
    )
}

export default SuporteLogado