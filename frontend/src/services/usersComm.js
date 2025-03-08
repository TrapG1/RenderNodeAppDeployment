import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/users';

//communicate with users collection

const getUserPersons = async (token) => {
    //define the auth header for this req
    const config ={
        headers: { Authorization: `Bearer ${token}` }
    }
    console.log(`${baseUrl}/persons`)
    const response = await axios.get(`${baseUrl}/persons`, config)
    return response.data
}


export default {
    getUserPersons
}