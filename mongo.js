const mongoose = require('mongoose')

const password = process.argv[2]

if (!password) {
  console.log('Usage: node mongo.js <password> [name number]')
  process.exit(1)
}

const url =
  `mongodb+srv://kevinrojas:268126@cluster0.9oypuos.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

mongoose.connect(url)
  .then(() => {
    if (process.argv.length === 3) {
      // Mostrar todos los contactos
      return Contact.find({}).then(contacts => {
        console.log("Phonebook:")
        contacts.forEach(c => {
          console.log(`${c.name} ${c.number}`)
        })
        mongoose.connection.close()
      })
    } else if (process.argv.length === 5) {
      // Guardar un nuevo contacto
      const contact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
      })

      return contact.save().then(() => {
        console.log(`Added ${contact.name} number ${contact.number} to phonebook`)
        mongoose.connection.close()
      })
    } else {
      console.log('Usage:')
      console.log('  node mongo.js <password>              # List all contacts')
      console.log('  node mongo.js <password> <name> <num> # Add a contact')
      mongoose.connection.close()
    }
  })
  .catch(err => {
    console.error('Error:', err.message)
    mongoose.connection.close()
  })
