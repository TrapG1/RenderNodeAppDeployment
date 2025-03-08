import express from 'express';
import User from '../models/users.js';
import bcrypt from 'bcrypt'

const userRouter = express.Router();

userRouter.post('/', async (request, response, next) => {
    try {
      const { username, name, password } = request.body
  
      // Hash the password before saving
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)
  
      const user = new User({
        username,
        name,
        passwordHash,
      })
      
      const savedUser = await user.save()
      response.status(201).json(savedUser)
  
    } catch (error) {
      // If error is not handled elsewhere (e.g., unique constraint violation)
        next(error) // Pass to error handling middleware
    }
})

userRouter.get('/', async (request, response) => {
  const users = await User
    //replaces the objectids in people part with refferncing people documents
    .find({}).populate('people', {name:1, number:1})
  response.json(users)
})  


// Get persons belonging to the authenticated user
userRouter.get('/persons', async (req, res, next) => {
  
  try {
    // Access user from the token (req.user is populated by the tokenExtractor)
    const user = await User.findById(req.user.id).populate('people', { name: 1, number: 1 });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send the list of persons associated with the user
    res.json(user.people);
  } catch (error) {
    next(error);
  }
});



export default userRouter
