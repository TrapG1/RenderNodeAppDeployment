import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import personsRouter from './controllers/persons.js'
import userRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import testingRouter from './controllers/testing.js'
import middleware from './utils/middleware.js'
import {info, error} from './utils/logger.js'
import {MONGODB_URI} from './utils/config.js'

const app = express()

// Set strictQuery to false to suppress warnings in MongoDB's query system
mongoose.set('strictQuery', false)

// Log that we're attempting to connect to MongoDB
info('connecting to', MONGODB_URI)

// Connect to MongoDB using the URI from the config(env), the 
//model is created in the model folder
mongoose.connect(MONGODB_URI)
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    error('error connecting to MongoDB:', error.message)
  })

// Middleware setup
//Any req comes to app and hits the middlewear first, express automatically fills the args
//for the middlewear with that of the single req its handling
// each middlewear has a next() since once its done handling the req, the next middlewear runs
//thats why order of middlewear at times is important
//
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())  // Parse incoming JSON requests
app.use(middleware.requestLogger)  // Custom request logging middleware
app.use('/api/login', loginRouter)

app.use(middleware.tokenExtractor)


// Define routes using the imported router
app.use('/api/persons', personsRouter)
app.use('/api/users', userRouter)

//router used for testing 
if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', testingRouter)
}
app.use(middleware.errorHandler)
// Handle unknown endpoints
app.use(middleware.unknownEndpoint)


export default app
