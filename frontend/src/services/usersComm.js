import axios from 'axios'
const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api/users';

//communicate with users collection

const getUserPersons = async (id) => {
    const response = await axios.get(`${baseUrl}/${id}`)
    return response
}


export default {
    getUserPersons
}