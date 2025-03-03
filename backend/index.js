import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { Person } from './models/person.js'
//loads envs from .env file for use
const app = express()

app.use(express.json())
app.use(cors())

//meta is the info about a js file, we get the file//.. path of indexjs, covert it to url
//and use it to get the dirname (backend)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// Create a custom Morgan token for logging POST data
morgan.token('post-data', (req, res) => {
  // Only log the data if the method is POST and there is a body
  if (req.method === 'POST' && req.body) {
    return JSON.stringify(req.body) // Serialize the body as a JSON string
  }
  return '-' // Return a placeholder if no body or method is not POST
})

// Configure Morgan to log the method, URL, status code, and POST data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', async (requesdt, response) => {
  try {
    const no_people = await Person.countDocuments({}) // ✅ Counts total documents in MongoDB
    const currentTime = new Date().toString()

    response.send(`
            <p>Number of persons: ${no_people}</p>
            <p>Request received at: ${currentTime}</p>
        `)
  } catch (error) {
    response.status(500).json({ error: 'Error fetching data from MongoDB' })
  }
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if (person){
      response.json(person)
    }
    else{
      response.status(404).end()
    }
  })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })

})

app.delete('/api/persons/:id', async (request, response) => {
  const id = request.params.id  // Get the id from the URL params
  try {
    const deletedPerson = await Person.findByIdAndDelete(id)  // Delete the person by id

    if (!deletedPerson) {
      return response.status(404).json({ error: 'Person not found' })  // Handle case where the person is not found
    }

    response.status(204).end()  // Successfully deleted, no content to return
  } catch (error) {
    console.error(error)  // Log the error for debugging
    response.status(500).json({ error: 'Error deleting person' })  // Send error response if something goes wrong
  }
})

app.post('/api/persons', async (request, response) => {
  const personBody = request.body

  try {
    // Create a new person with the request data
    const person = new Person({
      name: personBody.name,
      number: personBody.number
    })

    // Save the person to MongoDB
    const savedPerson = await person.save()
    response.json(savedPerson)

  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: 'Validation failed, required fields missing or invalid' })
    }

    // Handle duplicate name error (unique constraint violation)
    if (error.code === 11000) {
      return response.status(400).json({ error: 'Name already exists' })
    }

    // Handle any other errors
    response.status(500).json({ error: 'Server error' })
  }
})


app.put('/api/persons/:id', async (request, response) => {
  const id = request.params.id  // Get the id from the URL params
  const personBody = request.body  // Get the updated person data from the request body

  try {
    // Find the person by id and update with the new data
    const updatedPerson = await Person.findByIdAndUpdate(id, personBody, {
      new: true,  // Returns the updated document
      runValidators: true  // Ensures the new data passes schema validation
    })

    if (!updatedPerson) {
      return response.status(404).json({ error: 'Person not found' })  // Handle case where person is not found
    }

    response.json(updatedPerson)  // Return the updated person
  } catch (error) {
    console.error(error)  // Log the error for debugging
    response.status(500).json({ error: 'Error updating person' })  // Send error response if something goes wrong
  }
})


//use dir (backed) to find root and get dist folder (done by .static middleware)
app.use(express.static(path.join(__dirname, '../frontend/dist')))

// Serve frontend on any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})