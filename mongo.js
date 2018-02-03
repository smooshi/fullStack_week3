const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}
// korvaa url oman tietokantasi urlilla!
//const url = 'mongodb://testeri:testi@ds121118.mlab.com:21118/puhelinluettelo'
const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Person = mongoose.model('Person', {
  name: String,
  number: Number
})

if (process.argv[2] === undefined || process.argv[3] === undefined) {

  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name+" "+person.number)
      })
      mongoose.connection.close()
    })

} else {

   const person = new Person({
     name: process.argv[2],
     number: process.argv[3]
   })

  person
    .save()
    .then(response => {
      console.log('Person saved!')
      mongoose.connection.close()
    })
}

// const person = new Person({
//   name: 'Alyssa Edwards',
//   number: Math.random()
// })
//
// person
//   .save()
//   .then(response => {
//     console.log('Person saved!')
//     mongoose.connection.close()
//   })
