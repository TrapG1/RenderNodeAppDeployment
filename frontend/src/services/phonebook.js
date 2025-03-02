import axios from 'axios'
const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api/persons';


//js file to communitcate with phonebook database

//return promise of getting all
function getAll(){
  return axios.get(baseUrl)
}

//return promise of added obj
function create(newPerson){
  return axios.post(baseUrl, newPerson)
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
  deletePerson
}