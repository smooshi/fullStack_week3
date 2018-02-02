const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
    },
    {
      "name": "Alyssa",
      "number": "222",
      "id": 5
    }
  ]


  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  app.get('/info', (req, res) => {
    let size = persons.length
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    res.send('<p>Puhelinluettelossa on '+size+' henkilön tiedot </p>'+formatted)
  })

  app.get('/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person= persons.find(person => person.id === id )
  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

  app.post('/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
      return response.status(400).json({error: 'ERROR: no name'})
    } else if (body.number === undefined) {
      return response.status(400).json({error: 'ERROR: no number'})
    } else if (persons.filter(e => e.name === body.name).length > 0) {
      return response.status(400).json({error: 'ERROR: name exists'})
    }

    const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 0

    const person = {
      name: body.name,
      number: body.number,
      id: maxId+1
    }

    persons = persons.concat(person)
    response.json(person)
})
