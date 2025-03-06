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

export default userRouter
