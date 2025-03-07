// controllers/persons.js
//creates a router which can be resused in apps with just
//app.use('/api/persons', personsRouter), anything with /api/persons will get things from here
import express from 'express';
import Person from '../models/person.js';  // The Person model
import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import { SECRET } from '../utils/config.js';

const personsRouter = express.Router();


//the req is sent to the specific route after running through middleware in app.js
personsRouter.get('/', async (req, res, next) => {
  try {
    const persons = await Person.find({}).populate('user', { username: 1, name: 1 });
    res.json(persons);
  } catch (error) {
    next(error);  // if the response from db is an error it is sent to errorhandling middlewear
  }
});

personsRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
      const person = await Person.findById(id);
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    } catch (error) {
      next(error);  // Handle error
    }
});

personsRouter.post('/', async (req, res, next) => {
  try {

    const user = await User.findById(req.user.id)

    const { name, number} = req.body;

    if (!user) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    
    const person = new Person({ name, number, user: user._id });
    const savedPerson = await person.save();
    user.people = user.people.concat(savedPerson._id)
    await user.save()
    res.status(201).json(savedPerson);
  } catch (error) {
    next(error);  // Handle error
  }
});

personsRouter.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, number } = req.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      id,
      { name, number },
      { new: true, runValidators: true }
    );
    if (updatedPerson) {
      res.json(updatedPerson);
    } else {
      res.status(404).send({ error: 'Person not found' });
    }
  } catch (error) {
    next(error);  // Handle error
  }
});

personsRouter.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await Person.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    next(error);  // Handle error
  }
});

export default personsRouter;
