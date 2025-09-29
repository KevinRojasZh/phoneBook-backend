
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

let contacts = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.use(express.json())
app.use(cors())
morgan.token('body', (req,res)=> JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/persons', (request,response)=>{
  response.json(contacts)
  console.log(request)
})

app.get('/info',(resquest,response)=>{
  const nContacts = contacts.length
  const date = new Date
  response.send(`<p>Phonebook has info for ${nContacts} contacts </p> <br/> <p>${date}</p>`)
})

app.get('/persons/:id',(req,res)=>{
  const id = Number(req.params.id)
  const contact = contacts.find(objet => objet.id === id)

  if(contact){
    res.json(contact)
  }else{
    res.status(404).end()
  }
})

app.delete('/persons/:id',(req,res)=>{
  const id = req.params.id
  const newContacts = contacts.filter(objet => objet.id !== id )
  res.status(202).end()
})

app.post('/persons', (req,res)=>{

  if(req.body.number === '' || req.body.name === ''){
    res.status(409).json({ error: 'All fields are required' })
  }else if(contacts.some(contact => contact.name === req.body.name)){
    res.status(409).json({ error: 'name must be unique' })
  }
  else {
    console.log('entree')
    const id = contacts.length + 1 
    const newContact = {
      'id':id,
      'name':req.body.name,
      'number':req.body.number
    }
    contacts = contacts.concat(newContact)
    res.json(newContact)
  }
})



const PORT = process.env.PORT || 3001

app.listen(PORT,()=> {
  console.log('Server is runing on por:',PORT)
})

