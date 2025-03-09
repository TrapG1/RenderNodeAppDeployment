import { useRef, useEffect, useState } from 'react';
import Filter from './Components/Filter';
import PersonForm from './Components/PersonForm';
import Persons from './Components/Persons';
import personsComm from './services/personsComm';
import users from './services/usersComm';
import LoginForm from './Components/LoginForm';
import Togglable from './Components/Togglable';


const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null) 
  const [token, setToken] =useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const personFormRef = useRef()


  //functions use await to pause execution until persons.js returns the actual data 

  //once we get a response, make it the persons array, this will rerender the page
  useEffect(() => {
    const fetchPersons = async () => {
      if (!user) return //dont run if user not logged in yet

      try {
        const response = await users.getUserPersons(token);
        setPersons(response);
      } catch (error) {
        console.error("Error fetching data:", error);
        setPersons([]);
      }
    };
  
    fetchPersons();
  }, [user]);
  
  //will rerun everytime we refresh the tab
  useEffect(() =>{
    const loggedUserJson = window.localStorage.getItem('loggedPhonebookAppUser')
    if (loggedUserJson){
      const user = JSON.parse(loggedUserJson)
      setUser(user)
      setToken(user.token)
    }
  },[])

  //only once we get a response, which is the person obj with the same details (but server)
  //chosen id, it will add it to the persons array, rerendering the page. only adding after getting
  //a reponse ensures that the setpersons wont add nothing when the promise isnt fulfilled. 
  async function addPerson() {
    try {
      personFormRef.current.toggleVisibility()
      const newPerson = { name: newName, number: newPhone };
      const response = await personsComm.create(newPerson, token);
      console.log(response)
      setPersons((prevPersons) => [...prevPersons, response]);
      setNewName('');
      setNewPhone('');
    } catch (error) {
      console.error("Error uploading new person:", error);
    }
  }
  

  //if the user confirms the delete, then send the request once we get a response update the state
  //because there could have been an error, and showing the person removed in the frontend would be wrong
  async function deletePerson(id) {
    const personToDelete = persons.find(person => person.id === id);
    
    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      try {
        await personsComm.deletePerson(id, token);
        setPersons(prevPersons => prevPersons.filter(person => person.id !== id));
      } catch (error) {
        console.error('Error deleting person:', error);
        alert('Failed to delete the person. Please try again.');
      }
    }
  }
  

  //updates existing person obj in db, once positive response, update state for frontend. 
  async function updateExistingPerson(personID, newPerson) {
    try {
      const updatedPerson = await personsComm.updatePerson(personID, newPerson, token);
      setPersons(prevPersons => prevPersons.map(person => person.id === personID ? updatedPerson : person));
    } catch (error) {
      console.error('Error updating person:', error);
      alert('Failed to update the person number. Please try again.');
    }
  }
  
  function updateFilter(filter){
    setNewFilter(filter)
  }

  function LogOutUser(){
    setUser(null)
    setToken(null)
    window.localStorage.removeItem('loggedPhonebookAppUser')

  }
  // Filtered list of persons based on `newFilter`
  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );


  return (
    <div>
      <h2>Phonebook</h2>
      {user && <button onClick={LogOutUser}>Logout</button>}
      {user === null ? (
        <Togglable buttonLabel="Login" quitButtonLabel="Cancel">
          <LoginForm 
            setErrorMessage={setErrorMessage} 
            setUsername={setUsername} 
            setPassword={setPassword} 
            setToken={setToken}
            setUser={setUser} 
            username={username} 
            password={password} 
          />
        </Togglable>

      ) : (
        <>
          <Filter updateFilter={updateFilter} newFilter={newFilter} />
          <Togglable buttonLabel="Add Person" quitButtonLabel="Cancel" ref={personFormRef}>
            <PersonForm  
              newName={newName} 
              newPhone={newPhone} 
              setNewName={setNewName} 
              setNewPhone={setNewPhone} 
              persons={persons} 
              addPerson={addPerson} 
              updateExistingPerson={updateExistingPerson}
            />
          </Togglable>
          
          <h2>Numbers</h2>
          
          <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
        </>
      )}
    </div>
  );
  
};

export default App;
