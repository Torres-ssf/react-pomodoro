import { differenceInMinutes, format, formatDistanceToNow } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CycleContext } from '../../contexts/CycleContext'
import { HistoryContainer, HistoryList, Status } from './styles'
import { useNavigate } from 'react-router-dom'

export function History() {
  const { cycles, activeCycle } = useContext(CycleContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (activeCycle && activeCycle.finishedDate) {
      navigate('/')
    }
  }, [activeCycle, navigate])

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
                  {differenceInMinutes(Date.now(), cycle.startDate) >= 45
                    ? format(cycle.startDate, 'PPpp')
                    : formatDistanceToNow(cycle.startDate, { addSuffix: true })}
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
