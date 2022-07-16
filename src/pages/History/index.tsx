import { HistoryContainer, HistoryList, Status } from './styles'

export function History() {
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
            <tr>
              <td>Learn something new</td>
              <td>30 minutes</td>
              <td>2 months ago</td>
              <td>
                <Status statusColor="yellow">On going</Status>
              </td>
            </tr>
            <tr>
              <td>Learn something new</td>
              <td>30 minutes</td>
              <td>2 months ago</td>
              <td>
                <Status statusColor="green">Finished</Status>
              </td>
            </tr>
            <tr>
              <td>Learn something new</td>
              <td>30 minutes</td>
              <td>2 months ago</td>
              <td>
                <Status statusColor="green">Finished</Status>
              </td>
            </tr>
            <tr>
              <td>Learn something new</td>
              <td>30 minutes</td>
              <td>2 months ago</td>
              <td>
                <Status statusColor="red">Stopped</Status>
              </td>
            </tr>
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
