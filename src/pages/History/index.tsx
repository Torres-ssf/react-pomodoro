import { formatDistanceToNow } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CycleContext } from '../../contexts/CycleContext'
import { HistoryContainer, HistoryList, Status } from './styles'
import { useNavigate } from 'react-router-dom'

export function History() {
  const { cycles, isCycleFinished } = useContext(CycleContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (isCycleFinished) {
      navigate('/')
    }
  }, [isCycleFinished, navigate])

  return (
    <HistoryContainer>
      <h1>My History</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Task</th>
              <th>Duration</th>
              <th>Start</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {cycles.map(cycle => (
              <tr key={cycle.id}>
                <td>{cycle.task}</td>
                <td>{cycle.minutes} minutes</td>
                <td>
                  {formatDistanceToNow(cycle.startDate, { addSuffix: true })}
                </td>
                <td>
                  {cycle.interruptedDate && (
                    <Status statusColor="red">Interrupted</Status>
                  )}
                  {cycle.finishedDate && (
                    <Status statusColor="green">Finished</Status>
                  )}
                  {!cycle.finishedDate && !cycle.interruptedDate && (
                    <Status statusColor="yellow">On going</Status>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
