import { CountryLangs } from './CountryLangs';

export const CountryInformation = ({ name, capital, area, flagUrl, alt, selectedCountry, langs }) => {
  if (selectedCountry === null) {
    return null;
  }

  const spokenLanguages = Object.values(langs)

  return(
    <div>
      <h1>{name}</h1>
      <div>capital: {capital}</div>
      <div>area: {area}</div>
      <h2>languages:</h2>
      {spokenLanguages.map(lang =>
        <CountryLangs key={lang} langs={lang}/>
      )}
      <img src={flagUrl} alt={alt} />
    </div>
  );
}