import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan' 
import cors from 'cors'
import mongoose from "mongoose"
import path from "path";
import { fileURLToPath } from "url";
//loads envs from .env file for use
dotenv.config()
const app = express()

app.use(express.json())
app.use(cors());

//connects backend to mongodb via mongoose
const password = process.argv[2]
const url = `mongodb+srv://chanulpiyadi:${[password]}@cluster0.7youn.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

//meta is the info about a js file, we get the file//.. path of indexjs, covert it to url
//and use it to get the dirname (backend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Create a custom Morgan token for logging POST data
morgan.token('post-data', (req, res) => {
    // Only log the data if the method is POST and there is a body
    if (req.method === 'POST' && req.body) {
        return JSON.stringify(req.body); // Serialize the body as a JSON string
    }
    return '-'; // Return a placeholder if no body or method is not POST
});

// Configure Morgan to log the method, URL, status code, and POST data
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'));
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Fix: Reference `persons` instead of `notes`
const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(p => Number(p.id))) // Ensure IDs are numbers
      : 0
    return String(maxId + 1) // Convert to string for consistency
}

app.get('/', (request, response) => {
    response.send('<h1>Phonebook</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    let no_people = persons.length
    let currentTime = new Date().toString()
    response.send(
        `<p>Number of persons: ${no_people}</p>
        <p>Request received at: ${currentTime}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    let id = String(request.params.id)
    let person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    let id = String(request.params.id)
    persons = persons.filter(person => person.id !== id) 
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    console.log(request.body)
    const personBody = request.body 

    if (!personBody.name) {
        return response.status(400).json({ 
            error: 'name missing' 
        })
    }

    if (!personBody.number) {
        return response.status(400).json({ 
            error: 'number missing' 
        })
    }

    if (persons.some(person => person.name === personBody.name)) {
        return response.status(400).json({ error: 'name must be unique' })
    }

    const person = {
        "id": generateId(),
        "name": String(personBody.name), 
        "number": String(personBody.number)
    }

    persons = persons.concat(person)

    response.json(person)
})

app.put('/api/persons/:id', (request, response) => {
    const id = String(request.params.id)
    const personBody = request.body
    console.log(id)
    
    if (!personBody.name || !personBody.number) {
        return response.status(400).json({ error: 'name or number missing' })
    }

    const personIndex = persons.findIndex(person => person.id === id)
    if (personIndex === -1) {
        return response.status(404).json({ error: 'person not found' })
    }


    //merges old attributes with new
    const updatedPerson = { ...persons[personIndex], ...personBody }

    //replaces old with updated
    persons[personIndex] = updatedPerson

    response.json(updatedPerson)
})

//use dir (backed) to find root and get dist folder (done by .static middleware)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve frontend on any unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})