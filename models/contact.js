const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

const contactSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true,
    minLength:3
    },
    number:{
    type:String,
    required: true,
    minLength:9
    }
})

const Contact = mongoose.model('Contact', contactSchema)


contactSchema.set('toJSON',{
  transform:(document,returnedObject)=>{
    returnedObject.id= returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


console.log('conecting to', url )

mongoose.connect(url)
.then(()=> console.log('Connected to MongoDB'))
.catch(error =>console.log('ERROR',error.message))




module.exports = Contact