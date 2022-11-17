import { Match } from "./App"
import "./matchHistory.css"

interface MatchHistoryProps {
  history: Match[],
  clearHistory: () => void
}

export function MatchHistory({ history, clearHistory }: MatchHistoryProps) {
  return (
    <section className="history">
      <span>Last 15 matches:</span>
      <button onClick={clearHistory} >Clear History</button>
      <table>
        <tbody>
          <tr>
            <th>Deck</th>
            <th>Result</th>
            <th>Cubes</th>
            <th>Match</th>
          </tr>
          {
            history?.map(match => (
              <tr key={`${match.deck} ${match.id}`}>
                <td>{match.deck}</td>
                <td>{match.result}</td>
                <td>{match.cubes}</td>
                <td>{match.id}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </section>
  )
}