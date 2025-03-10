import { Router } from 'express';
import Person from '../models/person.js';
import User from '../models/users.js';
const testingRouter = Router();

testingRouter.post('/reset', async (req, res) => {
  await Person.deleteMany({});
  await User.deleteMany({});
  res.status(204).end();
});

export default testingRouter;
