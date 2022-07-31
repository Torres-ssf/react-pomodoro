import { differenceInMinutes, format, formatDistanceToNow } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CycleContext } from '../../contexts/CycleContext'
import {
  DeleteCyclesHistoryButton,
  HistoryContainer,
  HistoryContainerHeader,
  HistoryList,
  Status,
} from './styles'
import { useNavigate } from 'react-router-dom'
import { Trash } from 'phosphor-react'

export function History() {
  const { cycles, activeCycle, deleteCyclesHistory } = useContext(CycleContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (activeCycle && activeCycle.finishedDate) {
      navigate('/')
    }
  }, [activeCycle, navigate])

  function handleDeleteCyclesHistory() {
    deleteCyclesHistory()
  }

  const inactiveCycles = cycles.filter(c => c.id !== activeCycle?.id)

  const isDeleteButtonDisabled = !inactiveCycles.length

  return (
    <HistoryContainer>
      <HistoryContainerHeader>
        <h1>My History</h1>
        <DeleteCyclesHistoryButton
          type="button"
          onClick={handleDeleteCyclesHistory}
          disabled={isDeleteButtonDisabled}
        >
          <Trash size={24} weight="bold" />
          Delete history
        </DeleteCyclesHistoryButton>
      </HistoryContainerHeader>

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
