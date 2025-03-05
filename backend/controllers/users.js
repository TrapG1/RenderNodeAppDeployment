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
        console.error(error)
      // If error is not handled elsewhere (e.g., unique constraint violation)
      next(error) // Pass to error handling middleware
    }
})
  

export default userRouter
