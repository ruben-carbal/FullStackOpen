require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const Person = require('./models/person');

morgan.token('data', (request, response) => {
  return JSON.stringify(request.body);
})

const errorHandler = (error, request, response, next) => {
	if (error.name === 'CastError') {
		return response.status(400).send({error: 'malformated id'})
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(cors())
app.use(express.static('build'));

app.get('/api/persons', (request, response, next) => {
	Person.find({}).then(persons => {
    response.json(persons);
  })
  .catch(error => next(error))
})

app.get('/info', (request, response) => {
  const date = new Date();
	Person.find({})
    .then(person => {
	    person.map(per => per.toJSON())
      response.send(`<p>Phonebook has info for ${person.length} people <br /> ${date}</p>`)
    }) 
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(id)
  	.then(per => {
				if(per) {
					response.json(per);
		  } else {
					response.status(204).end();
			}
  })
  	.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	const id = request.params.id;
	Person.findByIdAndDelete(id).then(() => {
		response.status(204).end();
	})
	.catch(error => next(error))	
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body;
	
	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedNumber => {
    response.json(savedNumber)
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body;

	Person.findByIdAndUpdate(
    request.params.id, 
    { name, number }, 
    {new: true, runValidators: true, context: 'query' })
		.then(updatedNumber => {
			response.json(updatedNumber)
		})
		.catch(error => next(error))
}) 

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})