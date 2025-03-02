export default function PersonForm({updateExistingPerson, newName, newPhone, updateName, updateNumber, persons, addPerson}){
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // Prevent adding empty names or numbers
        if (newName.trim() === '' || newPhone.trim() === '') {
          alert("Name and phone number can't be empty");
          return;
        }
        

        //checks if users wants to update number, or captuers already existing persons
        let existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
        if (existingPerson) {
          if(existingPerson.number === newPhone){
            alert(`${newName} is already added to the phonebook`);
            return
          }
          if(window.confirm(`${newName} is already added to the phonebook, do you want to replace the number?`)){
            updateExistingPerson(existingPerson.id, {...existingPerson, number: newPhone})
          }
          return
        }
    
        // Add new person, no need to pass anyhting, handlechange alr updates state
        addPerson()

    };

    const handleChange = (e) => {
        updateName(e.target.value);
      };
    
      const handlePhoneChange = (e) => {
        updateNumber(e.target.value);
      };

    return(
        <form onSubmit={handleSubmit}>
            <div>
                Name: <input name="name" id="name" value={newName} onChange={handleChange} />
            </div>
            <div>
                Number: <input name="number" id="number" value={newPhone} onChange={handlePhoneChange} />
            </div>
            <div>
                <button type="submit">Add</button>
            </div>
      </form>
    )
}