const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json())
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
    response.json(persons)
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
    persons = persons.filter(person => person.id !== id) // Fix: Assign back to `persons`
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
