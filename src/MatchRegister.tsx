import { useEffect, useState } from "react"
import { Deck, Match } from "./App"
import "./matchRegister.css"

interface MatchRegsterProps {
  addMatch: (cubes: number) => void,
  setSelectedDeck: (deckName: string) => void,
  decks: Deck[],
  history: Match[]
}

export function MatchRegister({ addMatch, setSelectedDeck, decks, history }: MatchRegsterProps) {
  const [selectedtab, setSelectedTab] = useState(1)

  const [shouldAnimate, setShouldAnimate] = useState(false)

  function handleAddMatch(cubes: number) {
    navigator.vibrate(40)
    addMatch(cubes)
    setShouldAnimate(true)
    setTimeout(() => {
      setShouldAnimate(false)
    }, 250)
  }

  return (
    <section className="matchRegister">
      <label htmlFor="selectDeck">Choose a deck:</label>
      <select
        value={localStorage.getItem('defaultDeck') || 'default'}
        onChange={e => {
          localStorage.setItem('defaultDeck', e.target.value)
          setSelectedDeck(e.target.value)
        }}
        id="selectDeck">
        <option disabled value='default'> -- select a deck below -- </option>
        {decks?.map(item => (
          <option key={item.name} value={item.name}>{item.name}</option>
        ))}
      </select>
      <p>Set the result of the match:</p>
      <div className="tabs">
        <button className={selectedtab === 1 ? '' : 'inactive'} onClick={() => { setSelectedTab(1) }} >Victory</button>
        <button className={selectedtab === 2 ? '' : 'inactive'} onClick={() => { setSelectedTab(2) }} >Defeat</button>
      </div>
      {
        selectedtab === 1 && (
          <div className="buttons" >
            <button className="green" onClick={() => { handleAddMatch(1) }}>+1</button>
            <button className="green" onClick={() => { handleAddMatch(2) }}>+2</button>
            <button className="green" onClick={() => { handleAddMatch(4) }}>+4</button>
            <button className="green" onClick={() => { handleAddMatch(8) }}>+8</button>
          </div>
        )
      }
      {
        selectedtab === 2 && (
          <div className="buttons" >
            <button className="red" onClick={() => { handleAddMatch(-1) }}>-1</button>
            <button className="red" onClick={() => { handleAddMatch(-2) }}>-2</button>
            <button className="red" onClick={() => { handleAddMatch(-4) }}>-4</button>
            <button className="red" onClick={() => { handleAddMatch(-8) }}>-8</button>
          </div>
        )
      }
      <div className="feedBack" >
        <table>
          <tbody>
            <tr>
              <th>Deck</th>
              <th>Result</th>
              <th>Cubes</th>
            </tr>
            {
              history[0] !== undefined &&
              <tr className={shouldAnimate ? "firstA" : "first"} key={`${history[0]?.id} ${history[0]?.deck}`}>
                <td>{history[0]?.deck}</td>
                <td>{history[0]?.result}</td>
                <td>{history[0]?.cubes}</td>
              </tr>
            }
            {
              history[1] !== undefined &&
              <tr className={shouldAnimate ? "secondA" : "second"} key={`${history[1]?.id} ${history[1]?.deck}`}>
                <td>{history[1]?.deck}</td>
                <td>{history[1]?.result}</td>
                <td>{history[1]?.cubes}</td>
              </tr>
            }
            {
              history[2] !== undefined &&
              <tr className={shouldAnimate ? "thirdA" : "third"} key={`${history[2]?.id} ${history[2]?.deck}`}>
                <td>{history[2]?.deck}</td>
                <td>{history[2]?.result}</td>
                <td>{history[2]?.cubes}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  )
}