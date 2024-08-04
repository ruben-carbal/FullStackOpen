import { useState, useEffect } from 'react';
import axios from 'axios';
import { ListOfCountries } from './components/ListOfCountries';
import { Notification } from './components/Notification';
import { CountryInformation } from './components/CountryInformation';

function App() {
  const [countries, setCountries] = useState ([]);
  const [search, setSearch] = useState ('');
  const [message, setMessage] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null);
  //const [countriesToShow, setCountriesToShow] = useState([]);

  useEffect(() => {
      axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setCountries(response.data))
      .catch(error => console.error('Error fetching countries:', error));
    }
  , [])

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setSelectedCountry(null);
  }

  const filteredCountries = search ? countries.filter(el => 
    el.name.common.toLowerCase().includes(search.toLowerCase())) : [];

  let countriesToShow;
  if (filteredCountries.length === 1) {
    setSelectedCountry(filteredCountries[0]);
    countriesToShow = filteredCountries;
    setSearch('');
  } else if (filteredCountries.length > 10) {
    countriesToShow = [];
  } else {
    countriesToShow = filteredCountries;
  }
  
  // const countriesToShow = filteredCountries.length > 10 ? [] : filteredCountries;

  const handleShowClick = (el) => {
    setSelectedCountry(el);
    setSearch('')
  }
  
  useEffect(() => {
    if (filteredCountries.length > 10) {
      setMessage('Too many matches, specify another filter')
    } else {
      setMessage(null)
    }
  }, [filteredCountries]); 
  // const changeNotification = countriesToShow ? setMessage(null) : setMessage('Too many matches, specify another filter');

  return (
    <div className="App">
      <div>
        find countries <input value={search} onChange={handleSearch} />
      </div>
      {countriesToShow.map(el => 
      <ListOfCountries key={el.name.common} countryName={el.name.common} handleClick={() => handleShowClick(el)} />
      )}
      <Notification message={message}/>
      {selectedCountry && <CountryInformation selectedCountry={setSelectedCountry} name={selectedCountry.name.common} area={selectedCountry.area} capital={selectedCountry.capital} flagUrl={selectedCountry.flags.png} alt={selectedCountry.alt} langs={selectedCountry.languages} />}
    </div>
  );
}

export default App;
