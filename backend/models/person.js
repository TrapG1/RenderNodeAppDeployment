import dotenv from 'dotenv'

dotenv.config()
import mongoose from "mongoose"
mongoose.set('strictQuery',false)


const url = process.env.MONGODB_URI
console.log(url)
console.log('conntecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  number: { type: Number, required: true }
})
  

export const Person = mongoose.model('person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

