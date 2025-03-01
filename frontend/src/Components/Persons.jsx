export default function Persons({filteredPersons, deletePerson}){
    return(
      <div>
        {filteredPersons.map((person) => (
          <div key={person.id}>
            <p>{person.name} - {person.number}</p>
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </div>  
        ))}
      </div>
    )
    
}