// controllers/persons.js
//creates a router which can be resused in apps with just
//app.use('/api/persons', personsRouter), anything with /api/persons will get things from here
import express from 'express';
import Person from '../models/person.js';  // The Person model

const personsRouter = express.Router();
//the req is sent to the specific route after running through middleware in app.js
personsRouter.get('/', async (req, res, next) => {
  try {
    const persons = await Person.find({});
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
    const { name, number } = req.body;
    const person = new Person({ name, number });
    const savedPerson = await person.save();
    res.json(savedPerson);
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
