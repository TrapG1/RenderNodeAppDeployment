import Person from "../../models/person.js"; // Import the Person model

// Initial contacts to populate the database for testing
const initialPersons = [
  {
    name: "Alice Johnson",
    number: "123-456-7890",
  },
  {
    name: "Bob Smith",
    number: "987-654-3210",
  },
];

// Function to generate a non-existing person ID
const nonExistingId = async () => {
  const person = new Person({ name: "Temporary Contact", number: "000-000-0000" });
  await person.save(); // Save the contact to the DB
  await person.deleteOne(); // Remove it immediately after saving

  return person._id.toString(); // Return the ID as a string
};

// Helper function to get all contacts from the database
const personsInDb = async () => {
  const persons = await Person.find({});
  return persons.map(person => person.toJSON()); // Return all contacts as plain JavaScript objects
};

export { initialPersons, nonExistingId, personsInDb };
