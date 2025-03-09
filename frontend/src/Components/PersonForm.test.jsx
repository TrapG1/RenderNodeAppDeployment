import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PersonForm from './PersonForm'
beforeEach(() => {
    // Mock alert to avoid issues with the jsdom environment
    global.alert = vi.fn();
});

afterEach(() => {
    // Clean up mock after each test
    vi.clearAllMocks();
});
  
test('<PersonForm /> updates state and calls addPerson on submit', async () => {
  const addPerson = vi.fn()
  const updateExistingPerson = vi.fn()
  const setNewName = vi.fn()
  const setNewPhone = vi.fn()
  global.alert = vi.fn()
  
  const user = userEvent.setup()

  render(
    <PersonForm
      updateExistingPerson={updateExistingPerson}
      newName=""
      newPhone=""
      setNewName={setNewName}
      setNewPhone={setNewPhone}
      persons={[]} // Empty list initially
      addPerson={addPerson}
    />
  )

  const nameInput = screen.getByText("Name:")
  const phoneInput = screen.getByText("Number:")
  const submitButton = screen.getByRole('button', { name: /add/i })

  await user.type(nameInput, 'John Max')
  await user.type(phoneInput, '123-456-7890')
  await user.click(submitButton)

  expect(setNewName).toHaveBeenCalledWith('John Max')
  expect(setNewPhone).toHaveBeenCalledWith('123-456-7890')
  expect(addPerson).toHaveBeenCalledTimes(1)
})
