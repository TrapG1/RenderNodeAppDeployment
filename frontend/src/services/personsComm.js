import axios from 'axios';
 
const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api/persons';

//communicating with the persons collection db
//use await to return the actual data not a promise obj


const create = async (newPerson,token) => {
  const config = {
    headers: { Authorization:  `Bearer ${token}`  },
  };
  const response = await axios.post(baseUrl, newPerson, config);
  return response.data;
};

const deletePerson = async (id, token) => {
  const config = {
    headers: { Authorization:  `Bearer ${token}`  },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data
};

const updatePerson = async (id, newObject, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.put(`${baseUrl}/${id}`, newObject, config);
  return response.data;
};

export default {
  create,
  updatePerson,
  deletePerson
};
