const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><strong>total of {sum} exercises</strong></p>

const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>




const Course = ({ course }) => {
    const array = course.parts;
  
    const arrayOfExercises = array.map((el) => el.exercises)
    const total = arrayOfExercises.reduce((el, acc) => el + acc, 0)
  
    return(
      <div>
        <Header course={course.name} />
        {array.map(
          (part) => <Part key={part.id} part={part} />
        )}
        <Total sum={total}/>
      </div>
    ); 
  }

  export default Course;