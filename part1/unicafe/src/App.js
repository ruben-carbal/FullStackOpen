import { useState } from "react";

const Title = ({text}) => {return (<h1>{text}</h1>)}

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <p>No feedback given</p>
    );
  }
  return (
    <>
      <StatisticLine text='good' count={props.good}/>
      <StatisticLine text='neutral' count={props.neutral}/>
      <StatisticLine text='bad' count={props.bad}/>
      <StatisticLine text='total' count={props.total} />
      <StatisticLine text='average' count={props.average}/>
      <StatisticLine text='positive' count={props.positive} sign='%'/>
    </>
  );
}

const StatisticLine = ({text, count, sign}) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>{text}</td>
          <td>{count} {sign}</td>
        </tr>
      </tbody>
    </table>
  );
}

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  );
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);
 
  const handleGoodClick = () => {
    const updatedGood = good + 1;
    const updatedTotal = updatedGood + neutral + bad;
    setGood(updatedGood);
    setTotal(updatedGood + neutral + bad);
    setAverage((updatedGood - bad)/updatedTotal)
    setPositive((updatedGood/updatedTotal)*100)
  }
  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1;
    const updatedTotal = good + updatedNeutral + bad;
    setNeutral(updatedNeutral);
    setTotal(updatedTotal);
    setAverage((good - bad)/updatedTotal)
    setPositive((good/updatedTotal)*100)
  }
  const handleBadClick = () => {
    const updatedBad = bad + 1;
    const updatedTotal = good + neutral + updatedBad;
    setBad(updatedBad);
    setTotal(good + neutral + updatedBad);
    setAverage((good - updatedBad)/updatedTotal)
    setPositive((good/updatedTotal)*100)
  }

  return (
    <>
      <Title text='give feedback' />
      <Button onClick={handleGoodClick} text='good'/>
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad'/>
      <Title text='statistics' />
      <Statistics 
        good = {good}
        neutral = {neutral}
        bad = {bad}
        total = {total}
        average = {average}
        positive = {positive}/>
    </>
  )
}

export default App;
