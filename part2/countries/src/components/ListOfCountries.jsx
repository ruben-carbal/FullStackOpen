export const ListOfCountries = ({ countryName, handleClick }) => {
  return(
    <div>
      {countryName}<button onClick={handleClick}>show</button>
    </div>
  ); 
}