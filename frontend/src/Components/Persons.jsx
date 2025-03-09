import Togglable from "./Togglable"

export default function Persons({filteredPersons, deletePerson}){
    const sortedPersons = [...filteredPersons].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    return(
      <div>
        {sortedPersons.map((person) => (
          <div key={person.id} className="personItem">
            <p>{person.name}</p>
            <Togglable buttonLabel ="View number" quitButtonLabel="hide number">
              <p> - {person.number}</p>
            </Togglable>
            <button onClick={() => deletePerson(person.id)}>delete</button>
          </div>  
        ))}
      </div>
    )
}