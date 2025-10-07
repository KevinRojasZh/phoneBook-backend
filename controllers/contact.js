
const contactsRouter = require('express').Router()
const Contact = require('../models/contact')


//-------- METODOS -----------------------------------------

//GET TODOS LOS CONTACTOS
contactsRouter.get('/', (req,res) => {
  Contact.find().then(allContacts => res.json(allContacts))
})

//GET INFO DE LA AGENDA
// app.get('/info',(resquest,response)=>{
//   const nContacts = contacts.length
//   const date = new Date
//   response.send(`<p>Phonebook has info for ${nContacts} contacts </p> <br/> <p>${date}</p>`)
// })

//GET DETALLE CONTACTO
contactsRouter.get('/:id',(req,res,next ) => {
  Contact.findById(req.params.id).then(contact => {
    if(contact){
      res.json(contact)
    }else{
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

//DELETE CONTACTO
contactsRouter.delete('/:id',(req,res,next) => {

  Contact.findByIdAndDelete(req.params.id)
  .then(() => res.status(204).end())
  .catch(error => next(error))
})

//POST UN NUEVO CONTACTO
contactsRouter.post('/', (req,res,next) => {
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
    .catch(error => next(error))
  }
})
// UPDATE DE UN CONTACTO
contactsRouter.put('/:id',(req,res,next) => {
  const body = req.body

  const newContact = {
      'name': body.name,
      'number': body.number
    }
    Contact.findByIdAndUpdate(req.params.id,newContact,{ new:true, runValidators:true, context:'query' })
    .then(updateContact => {
      return res.json(updateContact)
    })
    .catch(error => {
      next(error)
    })
})

// -----------------------------------------------------


module.exports = contactsRouter


