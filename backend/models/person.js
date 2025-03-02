import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()
mongoose.set('strictQuery',false)


const password = process.argv[2]
const url = process.env.MONGODB_URI

console.log('conntecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

export const Person = mongoose.model('person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

