const mongoose = require('mongoose')
  , Schema = mongoose.Schema;

const url = 'mongodb://testeri:testi@ds121118.mlab.com:21118/puhelinluettelo'

mongoose.connect(url)
mongoose.Promise = global.Promise

const Person = mongoose.model('Person', {
  name: String,
  number: Number
})

const PersonSchema = new Schema({
  name: String,
  number: Number
})

module.exports = Person, PersonSchema

PersonSchema.statics.format = function(person){
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}
