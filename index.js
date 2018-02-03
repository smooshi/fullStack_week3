const http = require("http")
const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")

app.use(cors())
app.use(bodyParser.json())
app.use(express.static("build"))

morgan.token("json", function(req, res){ return JSON.stringify(req.body)})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :json"))

const Person = require("./models/person")

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

let persons = []
// let persons = [
//     {
//       "name": "Arto Hellas",
//       "number": "040-123456",
//       "id": 1
//     },
//     {
//       "name": "Martti Tienari",
//       "number": "040-123456",
//       "id": 2
//     },
//     {
//       "name": "Arto Järvinen",
//       "number": "040-123456",
//       "id": 3
//     },
//     {
//       "name": "Lea Kutvonen",
//       "number": "040-123456",
//       "id": 4
//     },
//     {
//       "name": "Alyssa",
//       "number": "222",
//       "id": 5
//     }
//]

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

//   const logger = (request, response, next) => {
//   console.log('Method:',request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
//
//   app.use(logger)

function getPeeps(callback) {
  Person.find({}, function(err, people) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, people)
    }
  })
}


app.get("/info", (req, res) => {
  getPeeps(function(err, people) {
    let size = people.length
    var dateTime = require("node-datetime")
    var dt = dateTime.create()
    var formatted = dt.format("Y-m-d H:M:S")
    res.send("<p>Puhelinluettelossa on "+size+" henkilön tiedot </p>"+formatted)
  })
})

app.get("/api/persons", (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(formatPerson))
    })
})

app.get("/api/persons/:id", (request, response) => {
  //console.log("ID? "+request.params.id)
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        //console.log("WHYYYY "+person.format)
        response.json(formatPerson(person))
      } else {
        response.status(404).end({ error:"?" })
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: "malformatted id" })
    })
})

app.delete("/api/persons/:id", (request, response) => {
  //const id = Number(request.params.id)
  Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: "malformatted id" })
    })
})

function getPeepName(pname, callback) {
  Person.find({ name: pname }, function(err, people) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, people[0])
    }
  })
}

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: "ERROR: no name" })
  } else if (body.number === undefined) {
    return response.status(400).json({ error: "ERROR: no number" })
  }

  getPeepName(body.name, function(err, people) {
    if (people == null) {
      const maxId = persons.length > 0 ? persons.map(n => n.id).sort().reverse()[0] : 0
      console.log(maxId)
      const person = new Person ({
        name: body.name,
        number: body.number,
        id: maxId+1
      })

      person
        .save()
        .then(person => {
          response.json(person)
        })
    } else {
      return response.status(400).json({ error: "Name already exists" })
    }
  })
})

app.put("/api/persons/:id", (request, response) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(request.params.id, person, { new: true } )
    .then(updatedPerson => {
      response.json(person.format)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: "malformatted id" })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
