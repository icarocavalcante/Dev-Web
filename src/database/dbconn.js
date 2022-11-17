import { FIREBASE_URL } from '../constants'
import {initializeApp} from 'firebase/app'
import { getDatabase } from 'firebase/database'

function DbConn() {
    const firebaseConfig = {
        apiKey: "API_KEY",
        authDomain: "256587071819.firebaseapp.com",
        databaseURL: `${FIREBASE_URL}`,
        projectId: "256587071819",
        storageBucket: "256587071819.appspot.com"
    }
    
    const app = initializeApp(firebaseConfig)
    
    return getDatabase(app)
}

export default DbConn