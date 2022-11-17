import { useState } from "react"
import { Deck } from "./App"
import { DeleteDeckButton } from "./DeleteDeckButton"
import "./deckManager.css"

interface DeckManagerProps {
  decks: Deck[],
  addDeck: (name: string) => void,
  deleteDeckFunction: (deckName: string) => void,
  setPage: (page: number) => void
}

export function DeckManager({ decks, addDeck, deleteDeckFunction, setPage }: DeckManagerProps) {
  const [deckName, setDeckName] = useState('')

  function handleAddDeck() {
    if (deckName.trim() == '') return
    addDeck(deckName)
    setDeckName('')
    setPage(0)
  }

  function handleInput(text: string) {
    if (text.length > 32) {
      alert("Deck name can't exceed 32 letters")
      return
    }
    setDeckName(text)
  }

  return (
    <section className="deckManager">
      <label htmlFor="newDeck">Type a name to add a new deck:</label>
      <input spellCheck={false} id="newDeck" maxLength={32} value={deckName} onChange={e => { handleInput(e.target.value) }} type="text" />
      <button onClick={handleAddDeck}>Add deck</button>
      <div className="tableContainer">
        <table>
          <tbody>
            <tr>
              <th>Deck</th>
              <th>Winrate</th>
              <th>Cubes</th>
              <th>Matches</th>
              <th>Victories</th>
              <th></th>
            </tr>
            {
              decks?.map(deck => (
                <tr key={deck.name} >
                  <td>{deck.name}</td>
                  <td>{(Math.round(deck.victories * 100 / deck.mathes)) || 0}%</td>
                  <td>{deck.cubesBalance}</td>
                  <td>{deck.mathes}</td>
                  <td>{deck.victories}</td>
                  <td><DeleteDeckButton deckName={deck.name} deleteDeckFunction={deleteDeckFunction} /></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

    </section>
  )
}