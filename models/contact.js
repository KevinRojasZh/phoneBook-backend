const mongoose = require('mongoose')

const contactSchema = new mongoose.Schema({
  name:{
    type:String,
    required: true,
    minLength:3
    },
    number:{
    type:String,
    required: true,
    minLength:9,
    validate:{
      validator: function(v){
      return /\d{3}-\d{3}-\d{3}/.test(v)
      },
      message:props => `${props.value} isn't fromated correct`
      }
    }
})

const Contact = mongoose.model('Contact', contactSchema)


contactSchema.set('toJSON',{
  transform:(document,returnedObject) => {
    returnedObject.id= returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = Contact