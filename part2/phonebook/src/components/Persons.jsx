const Persons = ({ name, number, deleteNumber}) => {
    return (
        <div>
            {name} {number}
            <button onClick={deleteNumber}>Delete</button>
        </div>
    );
}

export default Persons;