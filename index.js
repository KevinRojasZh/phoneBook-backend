
require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Contact= require('./models/contact')



app.use(express.json())

app.use(cors())

app.use(express.static('dist'))
morgan.token('body', (req,res)=> JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

//-------- METODOS -----------------------------------------

//GET TODOS LOS CONTACTOS
app.get('/api/persons', (req,res)=>{
  Contact.find().then(allContacts => res.json(allContacts))
})

//GET INFO DE LA AGENDA
// app.get('/info',(resquest,response)=>{
//   const nContacts = contacts.length
//   const date = new Date
//   response.send(`<p>Phonebook has info for ${nContacts} contacts </p> <br/> <p>${date}</p>`)
// })

//GET DETALLE CONTACTO
app.get('/api/persons/:id',(req,res,next )=>{
  Contact.findById(req.params.id).then(contact=>{
    if(contact){
      res.json(contact)
    }else{
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

//DELETE CONTACTO
app.delete('/api/persons/:id',(req,res,next)=>{
  
  Contact.findByIdAndDelete(req.params.id)
  .then(result => res.status(204).end())
  .catch(error => next(error))
})

//POST UN NUEVO CONTACTO
app.post('/api/persons', (req,res,next)=>{
  const body = req.body

  if( body.number === '' || body.name === ''){
    res.status(409).json({ error: 'All fields are required' })
  }else {
    const newContact = new Contact ({
      'name': body.name,
      'number': body.number
    })
    newContact.save()
    .then(saveContact => res.json(saveContact))
    .catch(error=> next(error))
  }
})
// UPDATE DE UN CONTACTO
app.put('/api/persons/:id',(req,res,next)=>{
  const body = req.body

  const newContact = {
      'name': body.name,
      'number': body.number
    }
    Contact.findByIdAndUpdate(req.params.id,newContact,{new:true, runValidators:true, context:'query'})
    .then(updateContact=>{
      return res.json(updateContact)
    })
    .catch(error=>{
      next(error)
    })
})

// -----------------------------------------------------

const errorHendler = (error, req, res, next)=> {
  console.log(error.message)
  if (error.name === 'CastError'){
    return res.status(400).send({error :'malformatted id'})
  }else if (error.name === 'ValidationError') {
    return res.status(400).send({error :'Some data are incorrect,try again'})
  }
  next(error)
}

app.use(errorHendler)

const PORT = process.env.PORT || 3001


app.listen(PORT,'0.0.0.0',()=> {
  console.log('Server is runing on por:',PORT)
})
