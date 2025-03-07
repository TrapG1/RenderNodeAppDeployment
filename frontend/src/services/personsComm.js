import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api/persons';

//communicating with the persons collection db
//use await to return the actual data not a promise obj
let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (newPerson) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newPerson, config);
  return response.data;
};

const deletePerson = async (id) => {
  await axios.delete(`${baseUrl}/${id}`);
};

const updatePerson = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject);
  return response.data;
};

export default {
  getAll,
  create,
  updatePerson,
  deletePerson,
  setToken,
};
