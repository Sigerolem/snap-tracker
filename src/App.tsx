import { useEffect, useState } from 'react'
import { MatchRegister } from './MatchRegister'
import { MatchHistory } from './MatchHistory'
import { DeckManager } from './DeckManager'

import { MdOutlineRestore } from 'react-icons/md'

export type Backup = {
  decks?: Deck[],
  history?: Match[],
  defaultDeck?: string
}

export type Match = {
  id: number,
  deck: string,
  result: string,
  cubes: number
}

export type Deck = {
  name: string,
  mathes: number,
  victories: number,
  cubesBalance: number
}

export function App() {
  const [isFirstRender, setIsFirstRender] = useState(true)

  const [page, setPage] = useState(0)
  const [backupPoppedUp, setbackupPoppedUp] = useState(false)

  const [decks, setDecks] = useState<Deck[]>([])
  const [selectedDeck, setSelectedDeck] = useState('')
  const [history, setHistory] = useState<Match[]>([])

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false)
      if (localStorage.getItem('decks') !== null) {
        setDecks(JSON.parse(localStorage.getItem('decks')!))
      }
      if (localStorage.getItem('history') !== null) {
        setHistory(JSON.parse(localStorage.getItem('history')!))
      }
      if (localStorage.getItem('defaultDeck') !== null) {
        setSelectedDeck(localStorage.getItem('defaultDeck')!)
      }
      return
    }
    localStorage.setItem('decks', JSON.stringify(decks))
    localStorage.setItem('history', JSON.stringify(history))
  }, [decks, history])

  useEffect(() => {
    const modal = document.getElementsByClassName('backupPopUp')[0]
    if (backupPoppedUp) {
      modal.addEventListener('click', e => {
        if (backupPoppedUp) {
          setbackupPoppedUp(false)
        }
      })
    } else {
      return
    }
    
    return () => {
      modal.addEventListener('click', e => {
        if (backupPoppedUp) {
          setbackupPoppedUp(false)
        }
      })
    }
  }, [backupPoppedUp])


  function addDeck(deckName: string) {
    if (decks?.find(item => { return item.name === deckName })) {
      alert('A deck with the same name already exists!')
      return
    }
    if (decks.length === 0) {
      setDecks([{ name: deckName, cubesBalance: 0, victories: 0, mathes: 0 }])
    } else {
      setDecks(prev => (
        [...prev, { name: deckName, cubesBalance: 0, victories: 0, mathes: 0 }]
      ))
    }
    localStorage.setItem('defaultDeck', deckName)
    setSelectedDeck(deckName)
  }

  function deleteDeck(deckName: string) {
    setDecks(prev => (prev.filter(deck => (
      deck.name !== deckName
    ))))
    if (selectedDeck === deckName) {
      setSelectedDeck('')
      localStorage.removeItem('defaultDeck')
    }
  }

  function addMatch(cubes: number) {
    if (selectedDeck === '') {
      alert('Select a deck before registering a match')
      return
    }
    let matchesWithSelectedDeck = 0
    decks?.forEach(deck => {
      if (deck.name === selectedDeck) {
        matchesWithSelectedDeck = deck.mathes
      }
    })
    setDecks(prev => (
      prev.map(
        deck => {
          if (deck.name === selectedDeck) {
            return {
              ...deck,
              cubesBalance: deck.cubesBalance + cubes,
              mathes: deck.mathes + 1,
              victories: cubes > 0 ? deck.victories + 1 : deck.victories
            }
          } else {
            return deck
          }
        }
      )
    ))
    setHistory(prev => {
      if (prev.length > 14) {
        prev.pop()
      }
      return [{ id: matchesWithSelectedDeck + 1, deck: selectedDeck, result: cubes > 0 ? 'Victory' : 'Defeat', cubes }, ...prev]
    })
  }

  async function backup() {
    let backup = {} as Backup
    if (localStorage.getItem('decks') !== null) {
      backup = {
        ...backup,
        decks: JSON.parse(localStorage.getItem('decks')!)
      }
    }
    if (localStorage.getItem('history') !== null) {
      backup = {
        ...backup,
        history: JSON.parse(localStorage.getItem('history')!)
      }
    }
    if (localStorage.getItem('defaultDeck') !== null) {
      backup = {
        ...backup,
        defaultDeck: localStorage.getItem('defaultDeck')!
      }
    }
    await navigator.clipboard.writeText(JSON.stringify(backup))
    alert('Backup copyed to the clipboard')
  }

  async function restore() {
    let restore = {} as Backup
    try {
      restore = JSON.parse(await navigator.clipboard.readText())
    } catch (error) {
      alert('Error getting backup from clipboard')
      return
    }
    if (restore === undefined || (restore.decks === undefined && restore.history === undefined && restore.defaultDeck === undefined)) {
      alert('Error getting backup from clipboard')
      return
    }
    if (restore.decks) {
      localStorage.setItem('decks', JSON.stringify(restore.decks))
      setDecks(restore.decks)
    }
    if (restore.history) {
      localStorage.setItem('history', JSON.stringify(restore.history))
      setHistory(restore.history)
    }
    if (restore.defaultDeck) {
      localStorage.setItem('defaultDeck', restore.defaultDeck)
      setSelectedDeck(restore.defaultDeck)
    }
    alert('Data restored from clipboard successfully')
  }

  async function handleBackupPopOver() {
    setbackupPoppedUp(true)
  }

  return (
    <>
      <header className='menu' >
        <button onClick={() => setPage(0)} className={page === 0 ? 'active' : ''}>Home</button>
        <button onClick={() => setPage(1)} className={page === 1 ? 'active' : ''}>History</button>
        <button onClick={() => setPage(2)} className={page === 2 ? 'active' : ''}>Decks</button>
        <button onClick={handleBackupPopOver} className={page === 2 ? 'active' : ''}>
          <MdOutlineRestore />
        </button>
        <div className='backupPopUp' style={backupPoppedUp ? { display: '' } : { display: 'none' }} >
          <div>
            <button onClick={backup} >Backup data to clipboard</button>
            <button onClick={restore} >Restore data from clipboard</button>
          </div>
        </div>
      </header>
      <main className="main">
        {
          page === 0 &&
          <MatchRegister addMatch={addMatch} decks={decks} setSelectedDeck={setSelectedDeck} history={history} />
        }
        {
          page === 1 &&
          <MatchHistory clearHistory={() => { setHistory([]) }} history={history} />
        }
        {
          page === 2 &&
          <DeckManager decks={decks} addDeck={addDeck} deleteDeckFunction={deleteDeck} setPage={setPage} />
        }
      </main>
    </>
  )
}
