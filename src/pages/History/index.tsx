import { differenceInMinutes, format, formatDistanceToNow } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CycleContext } from '../../contexts/CycleContext'
import {
  DeleteCycleButton,
  DeleteCyclesHistoryButton,
  HistoryContainer,
  HistoryContainerHeader,
  HistoryList,
  Status,
} from './styles'
import { useNavigate } from 'react-router-dom'
import { Trash } from 'phosphor-react'
import { defaultTheme } from '../../styles/themes/default'

export function History() {
  const { cycles, activeCycle, deleteCyclesHistory, deleteCycle } =
    useContext(CycleContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (activeCycle && activeCycle.finishedDate) {
      navigate('/')
    }
  }, [activeCycle, navigate])

  function handleDeleteCyclesHistory() {
    deleteCyclesHistory()
  }

  function handleDeleteCycle(cycleId: string) {
    deleteCycle(cycleId)
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
          Remove all entries
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
              <th></th>
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
                <td>
                  <DeleteCycleButton
                    role="button"
                    type="button"
                    disabled={activeCycle?.id === cycle.id}
                    onClick={() => handleDeleteCycle(cycle.id)}
                  >
                    <Trash
                      size={20}
                      weight="bold"
                      color={defaultTheme['red-500']}
                    />
                  </DeleteCycleButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
