require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

let persons =  []

morgan.token('data', (request, response) => {
  return JSON.stringify(request.body);
})

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(cors())
app.use(express.static('build'));

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
    response.json(persons);
  })
})

app.get('/info', (request, response) => {
  const entries = Person.length;
  const date = new Date();
  response.send(`<p>Phonebook has info for ${entries} people <br /> ${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = Person.findById(id).then(per => {
    response.json(per)
  });

  if(person) {
    response.json(person);
  } else {
		response.status(204).end();
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(per => per.id !== id);
	
	response.status(204).end();
})

// const generateId = () => {
// 	const maxId = persons.length > 0 ? 
// 		Math.max(...persons.map(per => per.id)) : 0
// 	return maxId + 1;
// }

app.post('/api/persons', (request, response) => {
	const body = request.body;

	if (!body.name || !body.number) {
		return response.status(404).json({
			error: 'Add complete info'
		})
	}

	// const names = persons.map(per => per.name)

	// if (names.includes(body.name)) {
	// 	return response.status(400).json({
	// 		error: 'name must be unique'
	// 	})
	// }
	
	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedNumber => {
    response.json(savedNumber)
  })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})