import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/persons';
import Notification from './components/Notification';
import Error from './components/Error';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [newSearch, setNewSearch] = useState('');
  const [newMessage, setNewMessage] = useState(null);
  const [newError, setNewError] = useState(null);

  const hook = () => {
    personService
      .getPersons()
      .then(initialPersons => {
      setPersons(initialPersons);
      })
  }

  useEffect(hook, []);



  const addName = (event) => {
    event.preventDefault();
    const validateName = persons.map((el) => el.name);

    const newPerson = {
      name: newName,
      number: newNumber
    }
    
    if (!validateName.includes(newName)) {
      // setPersons(persons.concat(newPerson));
      personService
        .createPerson(newPerson)
        .then(personToAdd => {
          setPersons(persons.concat(personToAdd));
        })
      
      setNewMessage(`Added ${newName}`);
      setTimeout(() => {
        setNewMessage(null);
      }, 4000)
    } else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const personToFind = persons.find(el => newName === el.name);
      const personId = personToFind.id;
      
      personService
        .updateNumber(personId, newPerson).then(numberUpdated => {
          setPersons(persons.map(per => per.id === personId ? numberUpdated : per))
        }).catch(error => 
          setNewError(`Information of ${newName} has already been removed from server`)
        )
      
        setNewMessage(`Changed ${newName}`);
        setTimeout(() => {
          setNewMessage(null);
        }, 4000)
    }

    setNewNumber('');
    setNewName('');
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }

  const handleNameSearch = (event) => {
    setNewSearch(event.target.value)
    // setPersons(persons.filter (person => person.name.toLowerCase().includes(newSearch.toLowerCase()))); 
    // NO HACER ESTO
  }

  const deleteNumber = (el) => {
    if(window.confirm(`Delete ${el.name} ?`)) {
      personService
      .deletePerson(el.id).then(() => 
        setPersons(persons.filter(person => person.id !== el.id))
      )
    }
  }

  const filteredPersons = persons.filter(person => 
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Error error={newError} />
      <Notification message={newMessage}/>
      <Filter value={newSearch} onChange={handleNameSearch} />
      <h2>add a new</h2>
      <PersonForm onSubmit={addName} name={newName} handleNameChange={handleNameChange} number={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <div>
        {filteredPersons.map((el) => 
        <Persons key={el.name} name={el.name} number={el.number} deleteNumber={() => deleteNumber(el)}/>)}
      </div>
    </div>
  )
}

export default App
