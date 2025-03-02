import mongoose from "mongoose"

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://chanulpiyadi:${[password]}@cluster0.7youn.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('person', personSchema)



note.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})

