import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Persons from './Persons'

test('renders content', () => {
    const persons = [
        { id: 1, name: 'Charlie', number: '123-456' },
        { id: 2, name: 'Alice', number: '234-567' },
        { id: 3, name: 'Bob', number: '345-678' },
        { id: 4, name: 'Eve', number: '456-789' },
        { id: 5, name: 'David', number: '567-890' }
    ]
    
    //make deleteperson do nothing 
    render(<Persons filteredPersons={persons} deletePerson={() => {}} />)

  const renderedPersons = screen.getByText('Charlie')
  screen.debug(renderedPersons)
  expect(renderedPersons).toBeDefined()
})