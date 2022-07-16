import { Play } from 'phosphor-react'
import { useState } from 'react'

import {
  StartCountdownButton,
  CountdownContainer,
  HomeContainer,
  FormHeader,
  Separator,
  TaskInput,
  MinutesAmountInput,
} from './styles'

export function Home() {
  const [interval, setInterval] = useState<undefined | number>(undefined)

  return (
    <HomeContainer>
      <form action="">
        <FormHeader>
          <label htmlFor="task">I&apos;m going to work on</label>
          <TaskInput
            id="task"
            type="text"
            placeholder="give a name to your task"
            list="task-suggestions"
          />
          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
          </datalist>

          <label htmlFor="minutesAmount">For</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            step={5}
            min={5}
            max={60}
            value={interval}
            onChange={e => setInterval(Number(e.target.value))}
            placeholder="45"
          />
          <span>minutes.</span>
        </FormHeader>

        <CountdownContainer>
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountdownContainer>

        <StartCountdownButton type="submit" disabled={!interval}>
          <Play size={24} />
          Start
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
