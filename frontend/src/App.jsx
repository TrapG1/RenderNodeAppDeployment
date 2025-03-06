import { useEffect, useState } from 'react';
import Filter from './Components/Filter';
import PersonForm from './Components/PersonForm';
import Persons from './Components/Persons';
import phonebook from './services/phonebook';
import login from './services/login';
import LoginForm from './Components/LoginForm';
import Login from './services/login';


const App = () => {
  const [persons, setPersons] = useState([{ name: 'Arto Hellas', number: '123-456' }]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const [errorMessage, setErrorMessage] = useState('')

  //once we get a response, make it the persons array, this will rerender the page
  useEffect(()=>{
    phonebook.getAll()
    .then(response => setPersons(response.data))
        .catch(error =>{
            console.error("error fetching data:", error)
            setPersons([])
          })
  },[])


  //only once we get a response, which is the person obj with the same details (but server)
  //chosen id, it will add it to the persons array, rerendering the page. only adding after getting
  //a reponse ensures that the setpersons wont add nothing when the promise isnt fulfilled. 
  function addPerson() {
    phonebook.create({ name: newName, number: newPhone })
    .then(response => {
      setPersons((prevPersons) => [...prevPersons, response.data]);
      setNewName('');
      setNewPhone('');
    })
    .catch(error => {
      console.error("error uploading new person", error);
    });
  }

  //if the user confirms the delete, then send the request once we get a response update the state
  //because there could have been an error, and showing the person removed in the frontend would be wrong
  function deletePerson(id){
    let personToDelete = persons.find(person => person.id ===id)
    if(window.confirm(`Delete ${personToDelete}?`)){
      phonebook.deletePerson(id)
      .then(() => setPersons(prevPersons => prevPersons.filter((person) => person.id !== id)))
      .catch((error) => {
        console.error('Error deleting person:', error);
        alert('Failed to delete the person. Please try again.');
      })
    }
    
  } 

  //updates existing person obj in db, once positive response, update state for frontend. 
  function updateExistingPerson(personID, newPerson){
    phonebook.updatePerson(personID, newPerson)
    .then(response => {
      setPersons(prevPersons => prevPersons.map(person => person.id === personID ? response.data : person))
    })
    .catch((error) => {
      console.error('Error updating person:', error);
      alert('Failed to update the person number. Please try again.');
    })
  }
  function updateName(name){
    setNewName(name)
  }

  function updateNumber(number){
    setNewPhone(number)
  }

  function updateFilter(filter){
    setNewFilter(filter)
  }

  // Filtered list of persons based on `newFilter`
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      {user === null ? (
        <LoginForm 
          setErrorMessage={setErrorMessage} 
          setUsername={setUsername} 
          setPassword={setPassword} 
          setUser={setUser} 
          username={username} 
          password={password}
        />
      ) : (
        <>
          <Filter updateFilter={updateFilter} newFilter={newFilter} />
  
          <PersonForm  
            newName={newName} 
            newPhone={newPhone} 
            updateName={updateName} 
            updateNumber={updateNumber} 
            persons={persons} 
            addPerson={addPerson} 
            updateExistingPerson={updateExistingPerson}
          />
          
          <h2>Numbers</h2>
          
          <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
        </>
      )}
    </div>
  );
  
};

export default App;
