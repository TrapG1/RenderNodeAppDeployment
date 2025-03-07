import axios from 'axios'
const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api/persons';


//js file to communitcate with phonebook database


let token = null

const setToken = newToken =>{
  token = `Bearer ${newToken}`
}
//return promise of getting all
function getAll(){
  return axios.get(baseUrl)
}

//return promise of added obj
const create = async (newPerson) => {
  //create the auth header and include the token for post req
  const config ={
    headers: {Authorization: token}
  }

  const response = await axios.post(baseUrl, newPerson, config)
  return response.data
}

function deletePerson(id){
  return axios.delete(`${baseUrl}/${id}`)
}

//returns a promise, response is person obj
function updatePerson(id, newObject){
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll, 
  create,
  updatePerson,
  deletePerson,
  setToken
}