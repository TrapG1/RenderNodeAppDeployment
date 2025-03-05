import User from "../../models/users.js"; // Import the User model
import bcrypt from "bcrypt";

// Initial users to populate the database for testing
const initialUsers = [
  {
    username: "alice123",
    name: "Alice Johnson",
    password: "password123", // Plain text, will be hashed before saving
  },
  {
    username: "bob_smith",
    name: "Bob Smith",
    password: "securepass456",
  },
];

// Function to generate a non-existing user ID
const nonExistingId = async () => {
  const user = new User({ username: "temp_user", name: "Temp User", passwordHash: "hashedpassword" });
  await user.save(); // Save the user to the DB
  await user.deleteOne(); // Remove it immediately after saving

  return user._id.toString(); // Return the ID as a string
};

// Helper function to get all users from the database
const usersInDb = async () => {
  const users = await User.find({});
  return users.map(user => user.toJSON()); // Return all users as plain JavaScript objects
};

// Function to initialize the database with hashed passwords
const initializeUsers = async () => {
  await User.deleteMany({}); // Clear existing users

  const userObjects = await Promise.all(
    initialUsers.map(async (user) => {
      const passwordHash = await bcrypt.hash(user.password, 10); // Hash password
      return new User({ username: user.username, name: user.name, passwordHash });
    })
  );

  const promiseArray = userObjects.map(user => user.save());
  await Promise.all(promiseArray);
};

export { initialUsers, nonExistingId, usersInDb, initializeUsers };
